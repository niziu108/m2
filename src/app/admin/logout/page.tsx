'use client'
import { useEffect } from 'react'

export default function Logout() {
  useEffect(() => {
    document.cookie = 'm2_admin=; Max-Age=0; path=/; SameSite=Lax'
    location.href = '/admin/login'
  }, [])
  return null
}
