import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { getNextjsCookie } from "./utils/server-cookie";

const protectedRoutes = ["/calendar", "/profile", "/feedback"];
const guestOnlyRoutes = ["/login", "/register"];
const adminRoute = "/admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  const requestCookie = request.cookies.get("pb_auth");
  const cookie = await getNextjsCookie(requestCookie);

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie);
    } catch (error) {
      console.error("Error loading auth store from cookie", error);
    }
  }

  const isAuthenticated = pb.authStore.isValid;
  const isAdmin = pb.authStore.model?.isAdmin === true;

  // Redirect authenticated users away from guest-only routes
  if (guestOnlyRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect non-admins from admin route
  if (pathname.startsWith(adminRoute)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/calendar", request.url));
    }
  }

  return response;
}