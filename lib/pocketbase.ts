'use server'

// Handles the PocketBase instance and user handling

import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { getNextjsCookie } from "@/utils/server-cookie";
import { Organisation, User } from './types';
import Client from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

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

export const getUserOrganisations = async (): Promise<Organisation[]> => {
  const cookieStore = cookies();
  const organisationsCookie = cookieStore.get('pb_organisations');
  if (!organisationsCookie) {
    return [];
  }
  const organisations = JSON.parse(organisationsCookie.value);
  return organisations;
}

export const getOrganisations = async (): Promise<Organisation[] | null> => {
  try {
    const organisation = await pb.collection('organisations').getFullList({
      sort: '-created', expand: 'shifts'
    });
    const mappedOrganisations: Organisation[] = organisation.map((record) => ({
      id: record.id,
      name: record.name,
      nrOfShifts: record.expand?.shifts?.length || 0
    }));
    return mappedOrganisations;
  } catch (error) {
    console.error("Error getting organisation: ", error);
    return null;
  }
}

export const getUsers = async (limit: number): Promise<User[] | null> => {
  try {
    const users = await pb.collection('users').getList(1, limit);
    console.log("fetch: ", users);

    const mappedUsers: User[] = users.items.map((record) => ({
      id: record.id,
      name: record.name,
      email: record.email,
      avatar: record.avatar,
      organisations: [],
      isAdmin: record.isAdmin
    }));
    return mappedUsers;
  } catch (error) {
    console.error("Error getting users: ", error);
    return null;
  }
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

export const getUser = async (pb?: Client, id: string = ""): Promise<User | null> => {
  pb = pb || await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return null;
  }

  // If no id is provided, use the current user's id
  if (id == "") {
    id = pb.authStore.model?.id;
  }

  try {
    const user = await pb.collection('users').getOne(id);
    const userOrganisations = await getUserOrganisations() || [];

    const mappedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      organisations: userOrganisations,
      isAdmin: user.isAdmin
    };
    return mappedUser;
  } catch (error) {
    console.error("Error getting user: ", error);
    return null;
  }
}

// TODO: Change to client?
// https://github.com/tigawanna/next-pocketbase-demo#readme
/// Login a user
/// Uses implementation from https://github.com/heloineto/nextjs-13-pocketbase-auth-example
export async function login(user: { username: string; password: string; }) {
  try {
    // Try to login the user with the provided credentials, if successful return true
    const { token, record: model } = await pb.collection('users').authWithPassword(user.username, user.password);

    // Get the users organisations
    const records = await pb.collection('organisations').getFullList({
      filter: `members ~ "${model.id}"`
    });
    const organisations = records.map((record) => ({
      id: record.id,
      name: record.name
    }));

    // Set the user's token and model in a cookie
    const cookie = JSON.stringify({ token, model });
    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: false,
    });
    // Set the user's organisations in a cookie
    cookies().set('pb_organisations', JSON.stringify(organisations), {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: false,
    });

    return "success";
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
      name: user.name,
      orginisations: [],
      isAdmin: false
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
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.collection('shifts').unsubscribe(); // remove all subscriptions in the collection
  pb.authStore.clear();
  cookies().delete('pb_auth');
  cookies().delete('pb_organisations');
  redirect('/');
}
/* #endregion */