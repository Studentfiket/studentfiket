'use server';

import { loadPocketBase } from "@/lib/pocketbase";
import { User } from "@/lib/types";

export const getMultipleUsers = async (limit: number, nameSearch: string): Promise<User[] | null> => {
  const pb = await loadPocketBase();
  if (!pb?.authStore.model) {
    console.error("No user logged in");
    return null;
  }
  try {
    const users = await pb.collection('users').getList(1, limit, {
      filter: `name ~ "${nameSearch}" || username ~ "${nameSearch}"`,
      sort: 'name'
    }
    );

    const mappedUsers: User[] = users.items.map((record) => ({
      id: record.id,
      username: record.username,
      name: record.name,
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