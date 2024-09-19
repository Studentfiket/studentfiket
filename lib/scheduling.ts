'use server'

import { RecordModel } from 'pocketbase';
// Handles the shift creation and retrieval

import { loadPocketBase } from './pocketbase';
import { Shift, User } from './types';

// Map the records from the database to the Shift type
export const mapRecordsToShifts = (records: RecordModel[]): Shift[] => {
  return records.map((record: RecordModel) => ({
    id: record.id,
    organisation: record.expand?.organisation === undefined ? "" : record.expand?.organisation.name,
    person1: record.workers[0] === undefined ? "" : record.expand?.workers[0].name,
    person2: record.workers[1] === undefined ? "" : record.expand?.workers[1].name,
    start: record.startTime,
    end: record.endTime
  }));
}

export const createShift = async (startTime: string, canOverride = false, isCreatingInBatch: boolean = false) => {
  const pb = await loadPocketBase();

  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  // Check if the shift is created between 08:00 and 16:00
  const startTimeDate = new Date(startTime).toISOString();
  const startHour = new Date(startTime).getHours();
  if (startHour < 8 || startHour > 16) {
    console.error("Shifts can only be created between 08:00 and 16:00");
    return;
  }

  // Calculate the end time of the shift (lunch shift is 1 hour, other shifts are 2 hours)
  const shiftLength = startHour === 12 ? 1 : 2;
  const endTimeDate = new Date(new Date(startTime).getTime() + shiftLength * 60 * 60 * 1000).toISOString();

  const shift = {
    startTime: startTimeDate,
    endTime: endTimeDate,
    workers: [],
    organisation: ""
  }

  // Disable auto cancellation if creating shifts in batch
  isCreatingInBatch ? pb.autoCancellation(false) : null;

  try {
    // Check if the shift already exists
    console.log('startTimeDate: ', startTimeDate.split('T')[0], startTimeDate.split('T')[1].split('Z')[0]);
    const startDate = new Date(startTimeDate.split('T')[0]).toISOString();
    const startTime = startTimeDate.split('T')[1].split('.')[0];

    const resultList = await pb.collection('shifts').getList(1, 5, {
      filter: `startTime = "${startDate} ${startTime}" `,
    });

    if (resultList.items.length > 0) {
      // If the shift already exists, return an error message
      if (!canOverride) {
        console.error("Shift already exists");
        return;
      }
      else {
        // If the shift already exists and can be overridden, delete the existing shift
        await pb.collection('shifts').delete(resultList.items[0].id);
      }
    }

    const createdShift = await pb.collection('shifts').create(shift);

    // Enable auto cancellation if creating shifts in batch
    isCreatingInBatch ? pb.autoCancellation(true) : null;

    return createdShift;
  }
  catch (error) {
    // Enable auto cancellation if creating shifts in batch
    isCreatingInBatch ? pb.autoCancellation(true) : null;
    console.error("Error creating shift: ", error);
    return
  }
}



/// Updates a shift in the database by its ID.
/// @param shiftId - The ID of the shift to be updated.
/// @returns A promise that resolves to an object containing a message and optionally the updated shift.
export const updateShift = async (shiftId: string, user: User, bookedOrganisationId: string, userIsBooking: boolean): Promise<{ message: string, shift?: Shift }> => {
  const validateWorkerToShift = () => {
    if (shift?.workers.length >= 2) {
      console.error("Shift is already full");
      return "Shift is already full";
    }
    if (shift?.workers.includes(pb?.authStore.model?.id)) {
      console.error("User is already in the shift");
      return "User is already in the shift";
    }
    if (shift?.organisation.length === 1) {
      // Check if the user is in the same organisation as the one already in the shift
      const userOrganisations = user.organisations || [];
      if (!userOrganisations.includes(shift.organisation)) {
        console.error("User is not in the same organisation as the shift");
        return "User is not in the same organisation as the shift";
      }
    }

    // If all checks pass, return empty string
    return "";
  }

  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return { message: "No user logged in" };
  }

  // Retrieve the current shift from the database, to make sure it is up to date
  const shift = await getShiftById(shiftId);
  if (!shift) {
    console.error("Shift not found");
    return { message: "Shift not found" };
  }

  // Validate the user to the shift
  const errorMessage = validateWorkerToShift();
  if (errorMessage !== "") {
    return { message: errorMessage };
  }

  if (userIsBooking) {
    // User is booking the shift
    // Add organisation to the shift
    if (shift.organisation === "") {
      shift.organisation = bookedOrganisationId;
    }

    // Add the user to the shift
    shift.workers.push(pb.authStore.model.id);
  }
  else {
    // User is canceling the shift
    // Remove the user from the shift
    const userIndex = shift.workers.indexOf(pb.authStore.model.id);
    if (userIndex > -1) {
      shift.workers.splice(userIndex, 1);
    }
    else {
      console.error("User not found in shift");
      return { message: "User not found in shift" };
    }

    // Remove the organisation if the shift is empty
    if (shift.workers.length === 0) {
      shift.organisation = "";
    }
  }


  try {
    const updatedShift = await pb.collection('shifts').update(shift.id, shift);
    return { message: "Shift updated successfully", shift: mapRecordsToShifts([updatedShift])[0] };
  } catch (error) {
    console.error("Error updating shift: ", error);
    return { message: "Error updating shift" };
  }
}

// TODO: fix the batch creation, without overloading the server
/// Generates new shifts for a given period.
/// @param startDate - The start date of the period.
/// @param endDate - The end date of the period.
/// @param canOverride - If true, the function will override existing shifts.
/// @returns A promise that resolves to a message when the shifts have been generated.
export const generateNewPeriod = async (startDate: Date, endDate: Date, canOverride: boolean = false): Promise<string> => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return "No user logged in";
  }

  const generateNewDay = async (date: Date) => {
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      for (let i = 8; i <= 15; i += 2) {
        if (i === 14) {
          i -= 1
        }
        const shiftStartTime = new Date(date.setHours(i, 0, 0, 0)).toISOString()
        createShift(shiftStartTime, canOverride, true);
      }
    }
  }

  // Generate new shifts for the period
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    console.log("Generating shifts for: ", d);
    await generateNewDay(d);
  }

  return "Done";
}

export const getShifts = async (): Promise<Shift[] | undefined> => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  try {
    const resultList = await pb.collection('shifts').getList(1, 50, {
      filter: 'startTime >= "2024-09-01 00:00:00" && startTime <= "2025-09-01 00:00:00"',
      expand: 'workers,organisation',
    });
    return mapRecordsToShifts(resultList.items);
  } catch (error) {
    console.error("Error getting shifts: ", error);
    return [];
  }
}

export const getShiftById = async (id: string) => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  try {
    const shift = await pb.collection('shifts').getOne(id);
    return shift;
  } catch (error) {
    console.error("Error getting shift: ", error);
    return;
  }

  // return loadedShifts.find(shift => shift.id === id);
}