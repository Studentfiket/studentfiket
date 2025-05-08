'use server'

import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

// Login a user
/// Uses implementation from https://github.com/heloineto/nextjs-13-pocketbase-auth-example
export async function login(user: { username: string; password: string; }): Promise<{ status: string, message: string }> {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

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
      httpOnly: true,
    });

    // Set the user's organisations in a cookie
    cookies().set('pb_organisations', JSON.stringify(organisations), {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: false,
    });

    return { status: "success", message: "" };
  } catch (error) {
    console.error("Login error: ", error);
    return { status: 'error', message: 'Ogiltigt användarnamn eller lösenord' };
  }
}