import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl text-center p-8">
        <h1 className="font-playfair text-4xl mb-4">DBMS SOC Dashboard</h1>
        <p className="text-subtext mb-8">A lightweight Security Operations Center dashboard demo.</p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-accent rounded-xl hover:brightness-105 transition text-light">Sign in</Link>
        </div>
      </div>
    </main>
  )
}
