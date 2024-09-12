// ./middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired } from 'pocketbase';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('pb_auth');
  const token = authCookie?.value ? JSON.parse(authCookie.value).token : null;

  if (request.nextUrl.pathname.startsWith('/calendar')) {
    // If there's no token or it's expired, redirect to login page.
    if (!token || isTokenExpired(token)) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  else if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
    // If there's a token, redirect to calendar page.
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = '/calendar';
      return NextResponse.redirect(url);
    }
  }
}