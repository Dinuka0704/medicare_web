import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getNavItems } from '@/components/layout/navConfig'
import { useAuth } from '@/context/AuthContext'

export function MainLayout() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const items = getNavItems(user.role)

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-200">
        <Sidebar items={items} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 animate-[fadeIn_0.15s_ease-out]" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-72 max-w-[80vw] flex-col border-r border-slate-200 shadow-xl animate-[slideInLeft_0.2s_ease-out]">
            <Sidebar items={items} onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full flex-col lg:pl-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
