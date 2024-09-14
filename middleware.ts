// ./middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { getNextjsCookie } from "./utils/server-cookie";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const request_cookie = request.cookies.get("pb_auth")
  // console.log("middlware request cookie  ===",)

  const cookie = await getNextjsCookie(request_cookie)
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  if (cookie) {
    console.log("cookie === ", cookie)
    try {
      // TODO: Fix stupid bug where my cookie is being deleted
      pb.authStore.loadFromCookie(cookie)
      console.log('Auth Model', pb.authStore.model) // Shows record
      console.log('Is Valid', pb.authStore.isValid) // True
      pb.authStore.isValid && await pb.collection('users').authRefresh()
    } catch (error) {

    }
  }

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection('user').authRefresh());
  } catch (err) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
    response.headers.set(
      "set-cookie",
      pb.authStore.exportToCookie({ httpOnly: false })
    );
  }

  if (request.nextUrl.pathname.startsWith("/login") && request.nextUrl.pathname.startsWith("/register")) {
    if (pb.authStore.model) {
      const redirect_to = new URL("/calendar", request.url);
      if (request.nextUrl.pathname) {
        redirect_to.search = new URLSearchParams({
          next: request.nextUrl.pathname,
        }).toString();
      } else {
        redirect_to.search = new URLSearchParams({
          next: '/',
        }).toString();
      }

      return NextResponse.redirect(redirect_to);
    }
  }

  if (pb.authStore.model && request.nextUrl.pathname.startsWith("/calendar")) {
    const next_url = request.headers.get("next-url") as string
    if (next_url) {
      const redirect_to = new URL(next_url, request.url);
      return NextResponse.redirect(redirect_to);
    }
    const redirect_to = new URL(`/`, request.url);
    return NextResponse.redirect(redirect_to);

  }

  return response;
}