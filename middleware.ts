import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/utils/jwt';

const protectedPaths = [
  '/',
  '/api/todo',
];

const apiPaths = [
  '/api/todo',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPathProtected = protectedPaths.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (!isPathProtected) {
    return NextResponse.next();
  }
  
  const isApiPath = apiPaths.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (isApiPath) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('token')?.value;
  
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('auth/signin', request.url));
  }
  return NextResponse.next();
}
