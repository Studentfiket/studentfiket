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

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!pb.authStore.isValid) {
      const redirect_to = new URL("/login", request.url);
      return NextResponse.redirect(redirect_to);
    }

    if (!pb.authStore.model?.isAdmin) {
      const redirect_to = new URL("/calendar", request.url);
      return NextResponse.redirect(redirect_to);
    }
  }

  return response;
}