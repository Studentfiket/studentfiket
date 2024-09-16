

import { getPb } from './pocketbase';


export async function loginUser(user: { username: string, password: string }) {
  try {
    const pb = await getPb();
    return await pb.collection('users').authWithPassword(user.username, user.password);
  } catch (error) {
    throw error;
  }
}