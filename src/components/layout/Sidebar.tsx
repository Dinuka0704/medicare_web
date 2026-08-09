import { LogOut, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { NavList } from './NavList'
import type { NavItem } from './navConfig'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useConfirm } from '@/context/ConfirmContext'

interface SidebarProps {
  items: NavItem[]
  onNavigate?: () => void
  onClose?: () => void
}

export function Sidebar({ items, onNavigate, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log out of Medicare?',
      description: "You'll need to sign in again to access your dashboard.",
      confirmLabel: 'Log out',
      danger: true,
    })
    if (ok) {
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <Logo />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavList items={items} onNavigate={onNavigate} />
      </div>

      {user && (
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-muted capitalize">{user.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
          >
            <LogOut className="size-[18px]" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
