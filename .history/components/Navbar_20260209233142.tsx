"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar(){
  const router = useRouter()
  const logout = async ()=>{
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_time')
    await fetch('/api/login',{method:'DELETE'})
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center px-6 backdrop-blur bg-black/30 border-b border-white/5 z-40">
      <div className="flex-1">
        <span className="font-playfair text-xl">DBMS SOC</span>
      </div>
      <nav className="flex gap-6 items-center">
        <Link href="/dashboard/attack" className="text-subtext hover:text-light transition">Attack</Link>
        <Link href="/dashboard/flow" className="text-subtext hover:text-light transition">Flow</Link>
        <Link href="/dashboard/packet" className="text-subtext hover:text-light transition">Packet</Link>
        <Link href="/dashboard/vulnerability" className="text-subtext hover:text-light transition">Vulnerability</Link>
        <button onClick={logout} className="px-3 py-2 bg-transparent border border-white/10 rounded hover:bg-white/5 transition">Logout</button>
      </nav>
    </header>
  )
}
