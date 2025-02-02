// ./middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { getNextjsCookie } from "./utils/server-cookie";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const request_cookie = request.cookies.get("pb_auth")

  const cookie = await getNextjsCookie(request_cookie)
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie)
    } catch (error) {
      console.error("Error loading auth store from cookie", error)
    }
  }

  // Redirect to /calendar if user is logged in and tries to access /login or /register
  if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
    if (pb.authStore.isValid) {
      const redirect_to = new URL("/calendar", request.url);
      return NextResponse.redirect(redirect_to);
    }
  }

  // Redirect to /login if user is not logged in and tries to access /calendar or /profile
  if (
    request.nextUrl.pathname.startsWith("/calendar") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/feedback")
  ) {
    if (!pb.authStore.isValid) {
      const redirect_to = new URL("/login", request.url);
      return NextResponse.redirect(redirect_to);
    }
  }

  // Redirect to /calendar if user is not admin and tries to access /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if user is logged in
    if (!pb.authStore.isValid) {
      const redirect_to = new URL("/login", request.url);
      return NextResponse.redirect(redirect_to);
    }

    // Check if user is admin
    if (!pb.authStore.model?.isAdmin) {
      const redirect_to = new URL("/calendar", request.url);
      return NextResponse.redirect(redirect_to);
    }
  }

  return response;
}