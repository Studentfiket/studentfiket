'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import placeholderShifts from "@/data/mockup-shifts";
import { Shift } from "./types";

const client = new PocketBase(process.env.POCKETBASE_URL);

// Check if the shift is booked, reserved or free
const checkAvailability = (shift: Shift) => {
  if (shift.organisation !== "") {
    if (shift.person1 !== "" && shift.person2 !== "") {
      return "booked";
    } else {
      return "reserved";
    }
  } else {
    return "free";
  }
}

export const getCurrentShifts = () => {
  return placeholderShifts;
}

export const getCurrentShiftsAsEventSources = () => {

  return placeholderShifts.map(shift => {
    return {
      id: shift.id,
      start: shift.start,
      end: shift.end,
      classNames: [checkAvailability(shift) + "-shift"]
    }
  });
}

export const getShiftById = (id: string) => {
  return placeholderShifts.find(shift => shift.id === id);
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
    fileName = client.authStore.model?.avatar;

  if (userId == "")
    userId = client.authStore.model?.id;

  try {
    // Get the current user's record. Use requestKey: null to avoid autocancelling the request if many avatar requests are made in a short time
    const record = await client.collection('users').getOne(userId, { requestKey: null });
    const url = client.files.getUrl(record, fileName, { 'thumb': '100x250' });

    return url;
  } catch (error) {
    console.error(error);
  }
}
/* #endregion */

/* #region Local user handling */

/// Login a user
/// Uses implementation from https://github.com/heloineto/nextjs-13-pocketbase-auth-example
export async function login(user: { email: string; password: string; }) {
  try {
    // Try to login the user with the provided credentials, if successful return true
    const { token, record: model } = await client.collection('users').authWithPassword(user.email, user.password);

    // Set the user's token and model in a cookie
    const cookie = JSON.stringify({ token, model });
    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    return true;
  } catch (error) {
    console.error("Login error: ", error);

    // If login fails, return false
    return false;
  }
}

/// Sign up a new user
export async function signUp(user: { name: string; username: string; email: string; password: string; }) {
  try {
    // Generate an avatar for the user and convert it to a SVG file (Blob)
    const svgString = await generateAvatar(user.username);
    const avatar = new Blob([svgString], { type: 'image/svg+xml' });

    // Try to create a new user with the provided data
    const data = {
      email: user.email,
      username: user.username,
      password: user.password,
      passwordConfirm: user.password,
      avatar: avatar,
      name: user.name
    };
    const createdUser = await client.collection('users').create(data);

    if (createdUser) {
      // If user was created successfully, try to login the user
      return await login({ email: user.email, password: user.password });
    }

  } catch (err) {
    // If user creation fails, log the error and return false
    console.error(err)
    return false
  }
}

/// Sign out the current user
export function signOut() {
  const id = client.authStore.model?.id;
  client.collection('users').unsubscribe(id);
  client.authStore.clear();
  cookies().delete('pb_auth');
  redirect('/login');
}
/* #endregion */