import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // tylko ścieżki /admin/*
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // NIE sprawdzaj hasła na stronie logowania i w API do logowania
  if (pathname.startsWith('/admin/login')) return NextResponse.next()

  // sprawdzamy ciasteczko
  const ok = req.cookies.get('m2_admin')?.value === process.env.ADMIN_SECRET
  return ok
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/admin/login', req.url))
}

// middleware tylko dla /admin/**
export const config = { matcher: ['/admin/:path*'] }
