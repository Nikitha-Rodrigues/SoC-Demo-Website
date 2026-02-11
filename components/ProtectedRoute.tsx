"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('auth_user')
    if (!user) {
      router.push('/login')
    } else {
      setIsAuthed(true)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuthed) return null

  return children
}
