"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const user = username.trim()
    if (!user || !password.trim()) return setError('Please provide username and password')
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: password.trim() })
      })
      const data = await res.json()
      setLoading(false)
      
      if (res.ok && data.username) {
        // Store auth in localStorage
        localStorage.setItem('auth_user', data.username)
        localStorage.setItem('auth_time', Date.now().toString())
        // Wait a bit for localStorage to sync, then redirect
        setTimeout(() => router.push('/dashboard/attack'), 100)
      } else {
        setError(data?.message || 'Invalid credentials')
      }
    } catch (err: any) {
      setLoading(false)
      setError('Network error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-section/80 backdrop-blur rounded-xl p-8 shadow-lg">
        <h2 className="font-playfair text-2xl mb-6">Sign in to DBMS SOC</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-subtext">Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-[#071913] text-light" placeholder="admin" />
          </div>
          <div>
            <label className="text-sm text-subtext">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-[#071913] text-light" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-accent rounded-xl text-light hover:brightness-110 transition disabled:opacity-50">{loading? 'Signing in...' : 'Sign in'}</button>
            <button type="button" onClick={()=>{setUsername(''); setPassword(''); setError('')}} className="px-4 py-2 border rounded-xl border-white/10 hover:bg-white/5 transition">Reset</button>
          </div>
        </form>
      </div>
    </div>
  )
}
