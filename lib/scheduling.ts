'use server'

// Handles the shift creation and retrieval

import Client, { RecordModel } from 'pocketbase';
import { loadPocketBase } from './pocketbase';
import { Shift, User } from './types';
import { DateTime } from "luxon";
import { log } from 'console';

// Map the records from the database to the Shift type
export const mapRecordsToShifts = (records: RecordModel[]): Shift[] => {
  return records.map((record: RecordModel): Shift => ({
    id: record.id,
    organisation: record.expand?.organisation?.name || "",
    workers: record.expand?.workers?.map((worker: { name: string }) => worker.name) || [],
    start: record.startTime,
    end: record.endTime
  }));
}

// TODO: fix the batch creation, without overloading the server
/// Generates new shifts for a given period.
/// @param startDate - The start date of the period.
/// @param endDate - The end date of the period.
/// @returns A promise that resolves to a message when the shifts have been generated.
export const generateNewPeriod = async (startDate: Date, endDate: Date): Promise<string> => {
  async function generateNewDay(date: DateTime) {
    const day = date.day;

    if (day !== 0 && day !== 6) {
      // Generate shifts for the day
      for (let i = 8; i <= 15; i += 2) {
        // Adjust the time for the lunch shift
        if (i === 14) {
          i -= 1
        }
        // Create the shift, using the Swedish timezone
        const shiftStartTime = DateTime.fromObject({ ...date.toObject(), hour: i, minute: 0, second: 0, millisecond: 0 }, { zone: "utc" }).toISO();
        if (!shiftStartTime) {
          console.error("Error creating shift start time");
          return;
        }
        pb && await createShift(shiftStartTime, true, pb);
      }
    }
  }

  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return "No user logged in";
  }

  // Generate new shifts for the period
  for (let d = DateTime.fromJSDate(startDate, { zone: "utc" }); d <= DateTime.fromJSDate(endDate, { zone: "utc" }); d = d.plus({ days: 1 })) {
    // Check if the day is a weekend day
    if (d.weekday !== 6 && d.weekday !== 7) {
      console.log("Generating shifts for: ", d.toFormat('dd-MM-yyyy'));
      await generateNewDay(d);
    }
    else {
      console.log("Skipping weekend day: ", d.toFormat('dd-MM-yyyy'));
    }

  }

  return "Done";
}

//#region Get shifts
export const getShifts = async (pbClient?: Client): Promise<Shift[] | undefined> => {
  const pb = pbClient || await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  // Get the date from the start of this week to the end of 3 weeks ahead
  const periodStart = DateTime.now().startOf('week').toISODate();
  const periodEnd = DateTime.now().plus({ weeks: 3 }).endOf('week').toISODate();

  try {
    const resultList = await pb.collection('shifts').getList(1, 100, {
      sort: 'startTime',
      filter: `startTime >= "${periodStart} 00:00:00" && startTime <= "${periodEnd} 00:00:00"`,
      expand: 'workers,organisation',
    });

    return mapRecordsToShifts(resultList.items);
  } catch (error) {
    console.error("Error getting shifts: ", error);
    return [];
  }
}

export const getShiftRecordById = async (pb: Client, id: string): Promise<RecordModel | null> => {
  console.log('Getting shift: ', id);

  try {
    const shiftRecord = await pb.collection('shifts').getOne(id, { expand: 'workers,organisation' });
    console.log('Found shift: ', shiftRecord);
    return shiftRecord;
  } catch (error) {
    console.error("Error getting shift: ", error);
    return null;
  }

  // return loadedShifts.find(shift => shift.id === id);
}

export const getShiftInfoById = async (id: string): Promise<{ organisation: string, workers: string[] } | null> => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return null;
  }

  const shiftRecord = await getShiftRecordById(pb, id);
  log('shiftRecord: ', shiftRecord);

  if (shiftRecord) {
    return {
      organisation: shiftRecord.expand?.organisation?.name || "",
      workers: shiftRecord.expand?.workers?.map((worker: { name: string }) => worker.name) || []
    }
  }

  return null;
}

export const getOrganisationShifts = async (pb: Client, orgId: string) => {

  const records = await pb.collection('shifts').getFullList({
    filter: `organisation = "${orgId}" && startTime <= "${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}"`,
  });

  return mapRecordsToShifts(records);
}

export const getUsersShifts = async (pb: Client, user: User) => {
  const records = await pb.collection('shifts').getFullList({
    filter: `workers ~ "${user.id}" && startTime <= "${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}" && organisation = null`,
  });
  return mapRecordsToShifts(records);
}
//#endregion

export const createShift = async (startTime: string, isCreatingInBatch: boolean = false, pb: Client) => {

  // const pb = await loadPocketBase();

  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  // Check if the shift is created between 08:00 and 16:00
  const startTimeDate = DateTime.fromISO(startTime).setZone('utc')
  console.log('startTimeDate: ', startTime, startTimeDate);
  const startHour = startTimeDate.hour
  if (startHour < 8 || startHour > 16) {
    console.error("Shifts can only be created between 08:00 and 16:00");
    return;
  }

  // Calculate the end time of the shift (lunch shift is 1 hour, other shifts are 2 hours)
  const shiftLength = startHour === 12 ? 1 : 2;
  const endTimeDate = DateTime.fromISO(startTime, { zone: "utc" }).plus({ hours: shiftLength }).toISO();

  const shift = {
    startTime: startTimeDate,
    endTime: endTimeDate,
    workers: [],
    organisation: ""
  }

  // Disable auto cancellation if creating shifts in batch
  isCreatingInBatch && pb.autoCancellation(false);

  try {
    // Check if the shift already exists
    const startDate = startTimeDate.toFormat('yyyy-MM-dd');
    const startTime = startTimeDate.toFormat("HH:mm:ss.SSS'Z'");
    console.log('      Start time: ', startDate, startTime);

    const resultList = await pb.collection('shifts').getList(1, 5, {
      filter: `startTime = "${startDate} ${startTime}"`,
    });

    if (resultList.items.length > 0) {
      // If the shift already exists, return an error message
      console.error("Shift already exists");
      return;
    }

    const createdShift = await pb.collection('shifts').create(shift);

    // Enable auto cancellation if creating shifts in batch
    isCreatingInBatch && pb.autoCancellation(true);

    return createdShift;
  }
  catch (error) {
    // Enable auto cancellation if creating shifts in batch
    isCreatingInBatch && pb.autoCancellation(true);
    console.error("Error creating shift: ", error);
    return
  }
}

/// Updates a shift in the database by its ID.
/// @param shiftId - The ID of the shift to be updated.
/// @returns A promise that resolves to an object containing a message and optionally the updated shift.
export const updateShift = async (shiftId: string, user: User, bookedOrganisationId: string, userIsBooking: boolean): Promise<{ message: string, shift?: Shift }> => {
  const validateWorkerToShift = () => {
    if (userIsBooking) {
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
  const shift = await getShiftRecordById(pb, shiftId);
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
      shift.organisation = bookedOrganisationId == 'private' ? "" : bookedOrganisationId;
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
    console.log('shift: ', shift);

    // TODO: Maybe dont need to return the updated shift. Should be taken care of by the subscription
    const updatedShift = await pb.collection('shifts').update(shift.id, shift);
    return { message: "Shift updated successfully", shift: mapRecordsToShifts([updatedShift])[0] };
  } catch (error) {
    console.error("Error updating shift: ", error);
    return { message: "Error updating shift" };
  }
}

