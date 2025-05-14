'use server'


import Client from 'pocketbase';
import { loadPocketBase } from '@/lib/pocketbase';
import { User } from '@/lib/types';
import { getUserOrganisations } from '../organisation/getUserOrganisations';

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
      username: user.username,
      name: user.name,
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