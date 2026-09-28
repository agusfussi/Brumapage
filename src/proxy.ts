import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from './lib/auth';

export default async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/gestion-bruma-privado/login';
  const isProtectedAdminRoute = request.nextUrl.pathname.startsWith('/gestion-bruma-privado') && !isLoginPage;

  const authCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const cookieVal = authCookie?.value ? authCookie.value.trim() : "";

  const isValidSession = await verifySessionToken(cookieVal);

  if (isProtectedAdminRoute && !isValidSession) {
    const response = NextResponse.redirect(new URL('/gestion-bruma-privado/login', request.url));
    if (cookieVal) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }

  if (isLoginPage && isValidSession) {
    return NextResponse.redirect(new URL('/gestion-bruma-privado', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/gestion-bruma-privado/:path*',
};
