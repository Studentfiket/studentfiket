'use server'

import { loadPocketBase } from '@/lib/pocketbase';
import { User } from '@/lib/types';

export const getLoggedInUser = async (): Promise<User | null> => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return null;
  }

  // Map model to user object
  const user: User = {
    id: pb.authStore.model.id,
    username: pb.authStore.model.username,
    name: pb.authStore.model.name,
    avatar: pb.authStore.model.avatar,
    organisations: [],
    isAdmin: pb.authStore.model.isAdmin
  };

  return user;
}