'use server'

import PocketBase from 'pocketbase';
import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { login } from "./login";

/// Sign up a new user
export async function register(user: { name: string; email: string; password: string; }): Promise<{ status: string, message: string }> {
  // Get LiU id from email
  const liuId = user.email.split('@')[0];

  try {
    // Generate an avatar for the user and convert it to a SVG file (Blob)
    const svgString = await generateAvatar(liuId);
    const avatar = new Blob([svgString], { type: 'image/svg+xml' });

    // Try to create a new user with the provided data
    const data = {
      email: user.email,
      username: liuId,
      password: user.password,
      passwordConfirm: user.password,
      avatar: avatar,
      name: user.name,
      organisations: "",
      isAdmin: false
    };

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const createdUser = await pb.collection('users').create(data);

    console.log('User created:', createdUser);


    if (createdUser) {
      // If user was created successfully, try to login the user
      return await login({ username: user.email, password: user.password });
    } else {
      // If user creation failed, log the error and return false
      return { status: 'error', message: 'Okänt fel' };
    }

  } catch (error) {
    // If user creation fails, log the error and return false
    console.error(error)
    return { status: 'error', message: 'Denna mail har redan ett konto' };
  }
}

async function generateAvatar(seed: string) {
  const svg = createAvatar(botttsNeutral, {
    seed: seed,
    radius: 40
  }).toString();

  return svg;
}