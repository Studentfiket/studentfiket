'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import placeholderShifts from "@/data/mockup-shifts";
// import { Shifts } from '@/lib/types';

const pb = new PocketBase(process.env.POCKETBASE_URL);
let loadedShifts: Shifts[] = [];

export const getPb = async () => {
  return pb;
}

export const createShift = async (startTime: string) => {
  const cookieStore = cookies()
  const pb_auth = cookieStore.get('pb_auth')?.value

  if (!pb_auth) {
    console.error("No auth cookie found");
    return;
  }

  pb.authStore.loadFromCookie(JSON.parse(pb_auth));

  try {
    // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
    pb.authStore.isValid && await pb.collection('users').authRefresh();
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  console.log(pb_auth);
  console.log(pb.authStore);
  const startTimeDate = new Date(startTime).toISOString();
  const endTimeDate = new Date(new Date(startTime).getTime() + 2 * 60 * 60 * 1000).toISOString();
  // console.log("Creating shift at: ", startTimeDate + " and " + endTimeDate);

  const shift = {
    startTime: startTimeDate,
    endTime: endTimeDate,
    workers: [],
    organisation: ""
  }

  // try {
  //   const createdShift = await pb.collection('shifts').create(shift);
  //   return createdShift;
  // }
  // catch (error) {
  //   console.error("Error creating shift: ", error);
  //   return
  // }
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

export const getShifts = async () => {
  return placeholderShifts;
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