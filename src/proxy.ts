import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const rawAdminToken = process.env.ADMIN_TOKEN;
  const ADMIN_TOKEN = rawAdminToken ? rawAdminToken.trim().replace(/^["']|["']$/g, "") : "";

  if (request.nextUrl.pathname.startsWith('/gestion-bruma-privado') && !request.nextUrl.pathname.startsWith('/gestion-bruma-privado/login')) {
    const authCookie = request.cookies.get('admin_session');
    const cookieVal = authCookie?.value ? authCookie.value.trim().replace(/^["']|["']$/g, "") : "";
    
    if (!ADMIN_TOKEN || !cookieVal || (cookieVal !== ADMIN_TOKEN && cookieVal.toLowerCase() !== ADMIN_TOKEN.toLowerCase())) {
      return NextResponse.redirect(new URL('/gestion-bruma-privado/login', request.url));
    }
  }
  
  if (request.nextUrl.pathname === '/gestion-bruma-privado/login') {
    const authCookie = request.cookies.get('admin_session');
    const cookieVal = authCookie?.value ? authCookie.value.trim().replace(/^["']|["']$/g, "") : "";
    
    if (ADMIN_TOKEN && cookieVal && (cookieVal === ADMIN_TOKEN || cookieVal.toLowerCase() === ADMIN_TOKEN.toLowerCase())) {
      return NextResponse.redirect(new URL('/gestion-bruma-privado', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/gestion-bruma-privado/:path*',
}
