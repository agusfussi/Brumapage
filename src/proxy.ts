import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  // Configura una contraseña quemada simple por ahora (puede moverse a .env)
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'bruma123';

  if (request.nextUrl.pathname.startsWith('/gestion-bruma-privado') && !request.nextUrl.pathname.startsWith('/gestion-bruma-privado/login')) {
    const authCookie = request.cookies.get('admin_session');
    
    if (authCookie?.value !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/gestion-bruma-privado/login', request.url));
    }
  }
  
  if (request.nextUrl.pathname === '/gestion-bruma-privado/login') {
    const authCookie = request.cookies.get('admin_session');
    
    if (authCookie?.value === ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/gestion-bruma-privado', request.url));
    }
  }
}

export const config = {
  matcher: '/gestion-bruma-privado/:path*',
}
