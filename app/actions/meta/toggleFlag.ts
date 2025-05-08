'use server'

import { loadPocketBase } from '@/lib/pocketbase';
import { getLoggedInUser } from '../users/getLoggedInUser';

export async function toggleFlag(name: string, newValue: boolean): Promise<boolean> {
  const pb = await loadPocketBase();
  const user = await getLoggedInUser();
  const isAdmin = user?.isAdmin || false;

  // Check if the user is logged in and is admin
  if (!isAdmin) {
    throw new Error("User is not logged in or is not an admin.");
  }

  // Get the id of the state
  const stateRecord = await pb.collection('states').getFirstListItem(`name="${name}"`);

  // Ensure we found a record before updating
  if (!stateRecord) {
    throw new Error(`Record with name "${name}" not found.`);
  }

  console.log('Updating record:', stateRecord);


  try {
    return await pb.collection('states').update(stateRecord.id, {
      isActive: newValue,
    });
  } catch (error) {
    console.error("Error updating record: ", error);
    throw new Error("Error updating record");
  }
}