import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import pool from '../../../lib/mysql'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = (body.username || '').toString().trim()
    const password = (body.password || '').toString()
    
    if (!username || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 })
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username])
    const user = (rows as any[])[0]
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    console.log(`[Auth] Login successful for user: ${username}`)
    return NextResponse.json({ ok: true, username })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  console.log('[Auth] Logout')
  return NextResponse.json({ ok: true })
}
