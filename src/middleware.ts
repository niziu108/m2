import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, adminUnauthorized, clearAdminCookie, isAdminRequest } from '@/lib/adminAuth'

export async function middleware(req: NextRequest) {
  if (await isAdminRequest(req)) return NextResponse.next()

  const { pathname } = req.nextUrl

  let res: NextResponse
  if (pathname === '/admin/login') {
    res = NextResponse.next() // strona logowania jest otwarta
  } else if (/^\/api(\/|$)/i.test(pathname)) {
    res = adminUnauthorized() // API dostaje 401 w JSON, nie stronę logowania
  } else {
    res = NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Nieważne ciasteczko (np. dawne, z samym hasłem) od razu znika z przeglądarki
  if (req.cookies.has(ADMIN_COOKIE)) clearAdminCookie(res)
  return res
}

// Samo logowanie i wylogowanie są w /api/auth, żeby w chronionych ścieżkach nie było żadnego wyjątku
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
