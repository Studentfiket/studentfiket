'use server'

import { loadPocketBase } from '@/lib/pocketbase';

export async function getFlag(name: string): Promise<boolean> {
  const pb = await loadPocketBase();

  // Get the id of the state
  const stateRecord = await pb.collection('states').getFirstListItem(`name="${name}"`);

  // Ensure we found a record before updating
  if (!stateRecord) {
    throw new Error(`Record with name "${name}" not found.`);
  }

  return stateRecord.isActive;
}