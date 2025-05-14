'use server'

import { loadPocketBase } from "@/lib/pocketbase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/// Sign out the current user
export async function logout() {
  const pb = await loadPocketBase();
  pb?.collection('shifts').unsubscribe(); // remove all subscriptions in the collection
  pb?.authStore.clear();
  cookies().delete('pb_auth');
  cookies().delete('pb_organisations');
  redirect('/');
}