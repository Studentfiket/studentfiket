'use server'

import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { getNextjsCookie } from "@/utils/server-cookie";

export const loadPocketBase = async (): Promise<PocketBase> => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const cookieStore = cookies();
  const pb_auth = cookieStore.get('pb_auth');
  const cookie = await getNextjsCookie(pb_auth);

  // Check if the auth cookie is present and load it into the auth store
  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie);
    } catch (error) {
      console.error("Error loading auth store from cookie", error);
      throw new Error("Error loading auth store from cookie");
    }
  }

  // Check if the auth store is valid and refresh the token if it is
  // Used to keep the user logged in
  if (pb.authStore.isValid) {
    try {
      await pb.collection('users').authRefresh();
    } catch (e) {
      console.error("Auth refresh failed", e);
      // Clear auth store
      pb.authStore.clear();
    }
  }

  return pb;
};