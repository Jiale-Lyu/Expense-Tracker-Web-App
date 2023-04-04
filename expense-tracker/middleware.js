import { NextResponse } from 'next/server';
import { secret } from './helpers/secret.js';
import jwt from '@tsndr/cloudflare-worker-jwt';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  let cookieHeader = request.cookies.get("authToken");
  if(cookieHeader && jwt.verify(cookieHeader.value, secret)){
  }
  else{
  return NextResponse.redirect(new URL('/', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/home', '/blogs', '/shoppinglist', '/charts', '/trackexpense', '/budget']
}