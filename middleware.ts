// ./middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { getNextjsCookie } from "./utils/server-cookie";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const request_cookie = request.cookies.get("pb_auth")

  const cookie = await getNextjsCookie(request_cookie)
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie)
    } catch (error) {
      console.error("Error loading auth store from cookie", error)
    }
  }

  // TODO: Get authRefresh working
  // try {
  //   // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
  //   pb.authStore.isValid && (await pb.collection('user').authRefresh());
  // } catch (err) {
  //   // clear the auth store on failed refresh
  //   pb.authStore.clear();
  //   response.headers.set(
  //     "set-cookie",
  //     pb.authStore.exportToCookie({ httpOnly: false })
  //   );
  // }

  if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
    if (pb.authStore.isValid) {
      const redirect_to = new URL("/calendar", request.url);
      return NextResponse.redirect(redirect_to);
    }
  }

  if (request.nextUrl.pathname.startsWith("/calendar")) {
    if (!pb.authStore.isValid) {
      const redirect_to = new URL("/login", request.url);
      return NextResponse.redirect(redirect_to);
    }
  }

  return response;
}