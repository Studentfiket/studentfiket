'use server'

// Handles the shift creation and retrieval

import { loadPocketBase } from './pocketbase';
import { Shift } from './types';

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

// TODO: fix the batch creation, without overloading the server
/// Generate new shifts for one period to the database
export const generateNewPeriod = async (startDate: Date, endDate: Date, canOverride: boolean = false) => {
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

  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  // Parse the dates into "YYYY-MM-DD" format
  // const startDateStr = startDate.toISOString().split('T')[0];
  // const endDateStr = endDate.toISOString().split('T')[0];

  // // Check if theres already shifts for the period
  // const resultList = await pb.collection('shifts').getList(1, 100, {
  //   filter: `startTime >= "${startDateStr} 00:00:00" && endTime <= "${endDateStr} 00:00:00"`,
  // });

  // Generate new shifts for the period
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    console.log("Generating shifts for: ", d);
    await generateNewDay(d);
  }

  // // Compare the generated shifts with the existing shifts and remove duplicates
  // const filteredShifts = shifts.filter(shift => !resultList.items.some(item => item.startTime === shift.startTime));

  // // Post the new shifts to the database
  // const createdShifts = await pb.collection('shifts').create(filteredShifts);

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
    const loadedShifts = resultList.items.map(item => ({
      id: item.id,
      organisation: item.expand?.organisation === undefined ? "" : item.expand?.organisation.name,
      person1: item.workers[0] === undefined ? "" : item.expand?.workers[0].name,
      person2: item.workers[1] === undefined ? "" : item.expand?.workers[1].name,
      start: item.startTime,
      end: item.endTime
    }));
    return loadedShifts;
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