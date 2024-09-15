'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import placeholderShifts from "@/data/mockup-shifts";
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
    console.log("cookie === ", cookie)
    try {
      pb.authStore.loadFromCookie(cookie)
      // pb.authStore.isValid && await pb.collection('users').authRefresh()
      return pb;
    } catch (error) {

    }
  }
}

// TODO: Get the loadFromCookie working
export const createShift = async (startTime: string, canOvveride = false) => {
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

  try {
    // Check if the shift already exists
    const resultList = await pb.collection('shifts').getList(1, 5, {
      filter: `startTime = "${startTimeDate}"`,
    });

    if (resultList.items.length > 0) {
      // If the shift already exists, return an error message
      if (!canOvveride) {
        console.error("Shift already exists");
        return;
      }
      else {
        // If the shift already exists and can be overridden, delete the existing shift
        await pb.collection('shifts').delete(resultList.items[0].id);
      }
    }

    const createdShift = await pb.collection('shifts').create(shift);
    return createdShift;
  }
  catch (error) {
    console.error("Error creating shift: ", error);
    return
  }
}

/// Generate new shifts for one period to the database
export const generateNewShifts = async (startDate: string, endDate: string) => {
  // Check if dates matches the format "YYYY-MM-DD"
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    console.error("Invalid date format");
    return;
  }

  // Make sure the period is empty before generating new shifts ()
  const resultList = await pb.collection('shifts').getList(1, 5, {
    filter: `startTime >= "${startDate} 00:00:00" && endTime <= "${endDate} 00:00:00"`,
  });

  if (resultList.items.length > 0) {
    return "Period is not empty";
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
    });
    loadedShifts = resultList.items.map(item => ({
      id: item.id,
      organisation: item.organisation,
      person1: item.workers[0],
      person2: item.workers[1],
      start: item.startTime,
      end: item.endTime
    }));
    return loadedShifts;
  } catch (error) {
    console.error("Error getting shifts: ", error);
    return [];
  }
}

export const getShiftById = (id: string) => {
  return loadedShifts.find(shift => shift.id === id);
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

    return true;
  } catch (error) {
    console.error("Login error: ", error);

    // If login fails, return false
    return false;
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