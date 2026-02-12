import { ReactNode } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />
        <div className="flex pt-20">
          <aside className="w-72 fixed left-0 top-20 bottom-0 bg-[#071913] p-6 border-r border-white/5">
            <Sidebar />
          </aside>
          <main className="ml-72 flex-1 p-8 bg-background min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
