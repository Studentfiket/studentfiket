'use server'

// Handles the shift creation and retrieval

import Client, { RecordModel } from 'pocketbase';
import { loadPocketBase } from './pocketbase';
import { Shift, User } from './types';
import { DateTime } from "luxon";
import { isCancellationAllowed } from '@/utils/sharedFunctions';

// Map the records from the database to the Shift type
export const mapRecordsToShifts = (records: RecordModel[]): Shift[] => {
  return records.map((record: RecordModel): Shift => ({
    id: record.id,
    organisation: record.expand?.organisation?.name ?? "",
    workers: record.expand?.workers?.map((worker: { name: string }) => worker.name) ?? [],
    start: record.startTime,
    end: record.endTime
  }));
}

/// Generates new shifts for a given period.
/// @param startDate - The start date of the period.
/// @param endDate - The end date of the period.
/// @param selectedHours - Which start hours to generate (8, 10, 12, 13, 15). Default = alla.
/// @returns A promise that resolves to a message when the shifts have been generated.
export const generateNewPeriod = async (
  startDate: Date,
  endDate: Date,
  selectedHours: number[] = [8, 10, 12, 13, 15]
): Promise<string> => {
  async function generateNewDay(date: DateTime) {

    if (date.weekday !== 6 && date.weekday !== 7) {
      // skapa bara de tider som är ikryssade (08-10, 10-12, osv)
      for (const shiftHour of selectedHours) {
        // Spara som väggklocka i UTC (08:00 UTC = pass 08-10), som i PocketBase
        // plus nu ingen Stockholm→UTC-omvandling som flyttar timmen :,)
        const shiftStartTime = DateTime.utc(
          date.year,
          date.month,
          date.day,
          shiftHour,
          0,
          0,
          0
        ).toISO();
        if (!shiftStartTime) {
          console.error("Error creating shift start time");
          return;
        }
        pb && await createShift(shiftStartTime, pb, true);
      }
    }
    else {
      console.log("Skipping weekend day: ", date.toFormat('dd-MM-yyyy'));
    }
  }

  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return "No user logged in";
  }

  if (selectedHours.length === 0) {
    console.error("No shifts selected");
    return "No shifts selected";
  }

  // Ta kalenderdagen (år/månad/dag) så vi inte råkar hamna fel pga timezone
  const start = DateTime.fromJSDate(new Date(startDate)).setZone("Europe/Stockholm").startOf("day");
  const end = DateTime.fromJSDate(new Date(endDate)).setZone("Europe/Stockholm").endOf("day");

  // Generate new shifts for the period
  for (let d = start; d <= end; d = d.plus({ days: 1 })) {
    // Check if the day is a weekend day
    if (d.weekday !== 6 && d.weekday !== 7) {
      console.log("Generating shifts for: ", d.toFormat('dd-MM-yyyy'), "hours:", selectedHours);
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

  // Get the date from the start of this week to the end of 8 weeks ahead
  // 3 veckor var för kort när man genererar längre fram
  const periodStart = DateTime.now().startOf('week').toISODate();
  const periodEnd = DateTime.now().plus({ weeks: 8 }).endOf('week').toISODate();

  try {
    const resultList = await pb.collection('shifts').getList(1, 500, {
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

export const getTodaysShifts = async (pbClient: Client): Promise<Shift[] | undefined> => {
  const pb = pbClient;

  // Hämta idag + nästa öppningsdag (imorgon, eller måndag om det är helg)
  const now = DateTime.now().setZone("Europe/Stockholm");
  const periodStart = now.startOf('day').toISODate();
  const daysAhead = now.weekday === 6 ? 2 : 1; // lördag → måndag, annars imorgon
  const periodEnd = now.plus({ days: daysAhead }).endOf('day').toISODate();

  console.log(periodStart, periodEnd);


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

/// Hämtar bokade pass för ett datum (väggklocka, t.ex. "2026-09-04").
/// dateStr skickas som YYYY-MM-DD så timezone-serialisering inte flyttar dagen.
export const getBookedShiftsForDate = async (dateStr: string): Promise<Shift[]> => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model?.isAdmin) {
    console.error("User is not admin");
    return [];
  }

  try {
    const resultList = await pb.collection('shifts').getList(1, 100, {
      sort: 'startTime',
      // Pass sparas som väggklocka UTC (08:00 = pass 08-10), filtrera på samma format
      filter: `startTime >= "${dateStr} 00:00:00.000Z" && startTime <= "${dateStr} 23:59:59.999Z"`,
      expand: 'workers,organisation',
    });

    // Kolla rådata (workers/org-id), inte bara expand – privat pass har org="" men workers ifyllda
    const bookedRecords = resultList.items.filter((record) => {
      const hasWorkers = Array.isArray(record.workers) && record.workers.length > 0;
      const hasOrganisation = typeof record.organisation === 'string' && record.organisation.length > 0;
      return hasWorkers || hasOrganisation;
    });

    return mapRecordsToShifts(bookedRecords);
  } catch (error) {
    console.error("Error getting booked shifts: ", error);
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

}

export const getNameFromId = async (id: string, collection: string): Promise<string> => {
  // The shift is private
  if (id === "")
    return "";

  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return "";
  }

  try {
    const record = await pb.collection(collection).getOne(id, { expand: 'name' });
    return record.name;
  } catch (error) {
    console.error(`Error getting ${collection} name: `, error);
    return "";
  }
}

export const getOrganisationShifts = async (pb: Client, orgId: string) => {

  const currentMonth = DateTime.now().month;
  const currentYear = DateTime.now().year;
  const periodStart = currentMonth <= 6 ? `${currentYear}-01-01 00:00:00` : `${currentYear}-07-01 00:00:00`;

  const records = await pb.collection('shifts').getFullList({
    filter: `organisation = "${orgId}" && startTime >= "${periodStart}" && startTime <= "${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}"`,
    requestKey: null,
  });

  return mapRecordsToShifts(records);
}

export const getUsersShifts = async (pb: Client, user: User) => {
  const currentMonth = DateTime.now().month;
  const currentYear = DateTime.now().year;
  const periodStart = currentMonth <= 6 ? `${currentYear}-01-01 00:00:00` : `${currentYear}-07-01 00:00:00`;

  const records = await pb.collection('shifts').getFullList({
    filter: `workers ~ "${user.id}" && startTime >= "${periodStart}" && startTime <= "${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}"`,
    expand: 'organisation',
  });
  console.log('records: ', records);
  return mapRecordsToShifts(records);
}
//#endregion

export const createShift = async (startTime: string, pb: Client, isCreatingInBatch: boolean = false) => {

  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  // tiderna sparas som väggklocka (08:00 UTC = pass 08-10)
  const startTimeDate = DateTime.fromISO(startTime, { zone: "utc" })
  const startHour = startTimeDate.hour
  console.log('startTimeDate: ', startTime, startTimeDate, 'hour:', startHour);
  if (startHour < 8 || startHour > 16) {
    console.error("Shifts can only be created between 08:00 and 16:00");
    return;
  }

  // Lunch 12-13 är 1h, övriga 2h
  const shiftLength = startHour === 12 ? 1 : 2;
  const endTimeDate = startTimeDate.plus({ hours: shiftLength });

  // Spara som sträng i samma format som PocketBase visar
  const shift = {
    startTime: startTimeDate.toFormat("yyyy-MM-dd HH:mm:ss.SSS'Z'"),
    endTime: endTimeDate.toFormat("yyyy-MM-dd HH:mm:ss.SSS'Z'"),
    workers: [],
    organisation: ""
  }

  // Disable auto cancellation if creating shifts in batch
  isCreatingInBatch && pb.autoCancellation(false);

  try {
    // Check if the shift already exists
    const startDate = startTimeDate.toFormat('yyyy-MM-dd');
    const startTimeFmt = startTimeDate.toFormat("HH:mm:ss.SSS'Z'");
    console.log('      Start time: ', startDate, startTimeFmt);

    const resultList = await pb.collection('shifts').getList(1, 5, {
      filter: `startTime = "${startDate} ${startTimeFmt}"`,
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

// TODO: Refactor to a smaller footprint
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
    // Validate that the date still allows for canceling the shift (at least 3 days before the shift)
    if (!isCancellationAllowed(shift.startTime)) {
      console.error("Too late to cancel the shift");
      return { message: "Too late to cancel the shift" };
    }

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
    // TODO: Maybe dont need to return the updated shift. Should be taken care of by the subscription
    const updatedShift = await pb.collection('shifts').update(shift.id, shift);
    return { message: "Shift updated successfully", shift: mapRecordsToShifts([updatedShift])[0] };
  } catch (error) {
    console.error("Error updating shift: ", error);
    return { message: "Error updating shift" };
  }
}

