'use server'

import { loadPocketBase } from '@/lib/pocketbase';
import { getLoggedInUser } from '../users/getLoggedInUser';

export async function clearShift(shiftId: string): Promise<{ success: boolean; message: string }> {
  const user = await getLoggedInUser();
  if (!user?.isAdmin) {
    return { success: false, message: 'Endast admin kan rensa pass' };
  }

  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    return { success: false, message: 'Inte inloggad' };
  }

  try {
    await pb.collection('shifts').update(shiftId, {
      workers: [],
      organisation: '',
    });
    return { success: true, message: 'Passet har rensats' };
  } catch (error) {
    console.error('Error clearing shift: ', error);
    return { success: false, message: 'Kunde inte rensa passet, kontakta webbansvarig' };
  }
}
