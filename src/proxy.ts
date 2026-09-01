import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

  if (request.nextUrl.pathname.startsWith('/gestion-bruma-privado') && !request.nextUrl.pathname.startsWith('/gestion-bruma-privado/login')) {
    const authCookie = request.cookies.get('admin_session');
    
    if (!ADMIN_TOKEN || !authCookie?.value || authCookie.value !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/gestion-bruma-privado/login', request.url));
    }
  }
  
  if (request.nextUrl.pathname === '/gestion-bruma-privado/login') {
    const authCookie = request.cookies.get('admin_session');
    
    if (ADMIN_TOKEN && authCookie?.value === ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/gestion-bruma-privado', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/gestion-bruma-privado/:path*',
}
