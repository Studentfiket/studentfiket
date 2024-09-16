'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { getNextjsCookie } from "@/utils/server-cookie";
import { Shift } from '@/lib/types';

const pb = new PocketBase(process.env.POCKETBASE_URL);
let loadedShifts: Shift[] = [];

export const loadPocketBase = async () => {
  if (pb.authStore.isValid) {
    return pb;
  }

  const cookieStore = cookies();
  const pb_auth = cookieStore.get('pb_auth');
  const cookie = await getNextjsCookie(pb_auth)
  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie)
      // pb.authStore.isValid && await pb.collection('users').authRefresh()
      return pb;
    } catch (error) {

    }
  }
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
      expand: 'workers'
    });
    loadedShifts = resultList.items.map(item => ({
      id: item.id,
      organisation: item.organisation,
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

/* #region Avatar */
async function generateAvatar(seed: string) {
  const svg = createAvatar(botttsNeutral, {
    seed: seed,
    radius: 40
  }).toString();

  return svg;
}

export async function getAvatar(userId: string, fileName: string) {
  if (fileName == "")
    fileName = pb.authStore.model?.avatar;

  if (userId == "")
    userId = pb.authStore.model?.id;

  try {
    // Get the current user's record. Use requestKey: null to avoid autocancelling the request if many avatar requests are made in a short time
    const record = await pb.collection('users').getOne(userId, { requestKey: null });
    const url = pb.files.getUrl(record, fileName, { 'thumb': '100x250' });

    return url;
  } catch (error) {
    console.error(error);
  }
}
/* #endregion */

/* #region Local user handling */

export const getUser = async (id: string = "") => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return;
  }

  if (id == "") {
    id = pb.authStore.model?.id;
  }

  try {
    const user = await pb.collection('users').getOne(id);
    return user;
  } catch (error) {
    console.error("Error getting user: ", error);
    return;
  }
}

// TODO: Change to client?
// https://github.com/tigawanna/next-pocketbase-demo#readme
/// Login a user
/// Uses implementation from https://github.com/heloineto/nextjs-13-pocketbase-auth-example
export async function login(user: { username: string; password: string; }) {
  try {
    console.log("Logging in user: ", user);
    // Try to login the user with the provided credentials, if successful return true
    const { token, record: model } = await pb.collection('users').authWithPassword(user.username, user.password);
    console.log("model: " + pb.authStore.model?.id)

    // pb.authStore.exportToCookie({ httpOnly: false });
    // const pbAuth = cookies().get('pb_auth')?.value;
    // if (typeof pbAuth === 'string') {
    //   pb.authStore.loadFromCookie(pbAuth);
    // } else {
    //   console.error("No auth cookie found");
    //   return;
    // }

    // Set the user's token and model in a cookie
    const cookie = JSON.stringify({ token, model });
    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: false,
    });
    console.log("Cookie: ", cookie);

    return "Success";
  } catch (error) {
    console.error("Login error: ", error);
    return "bad credentials";
  }
}

/// Sign up a new user
export async function signUp(user: { name: string; email: string; password: string; }) {
  // Get LiU id from email
  const liuId = user.email.split('@')[0];

  try {
    // Generate an avatar for the user and convert it to a SVG file (Blob)
    const svgString = await generateAvatar(liuId);
    const avatar = new Blob([svgString], { type: 'image/svg+xml' });

    // Try to create a new user with the provided data
    const data = {
      email: user.email,
      username: liuId,
      password: user.password,
      passwordConfirm: user.password,
      avatar: avatar,
      name: user.name
    };
    const createdUser = await pb.collection('users').create(data);

    // TODO: Add user to user_data collection

    if (createdUser) {
      // If user was created successfully, try to login the user
      return await login({ username: user.email, password: user.password });
    }

  } catch (err) {
    // If user creation fails, log the error and return false
    console.error(err)
    return false
  }
}

/// Sign out the current user
export async function signOut() {
  const id = pb.authStore.model?.id;
  pb.collection('users').unsubscribe(id);
  pb.authStore.clear();
  cookies().delete('pb_auth');
  redirect('/login');
}
/* #endregion */