import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useConfirm } from '@/context/ConfirmContext'
import { useData } from '@/context/DataContext'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/layout/Logo'
import { timeAgo } from '@/utils/format'
import { cn } from '@/utils/cn'

interface TopbarProps {
  onMenuClick: () => void
}

const today = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date('2026-08-09'))

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const { notifications, markNotificationRead } = useData()
  const [search, setSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

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
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 backdrop-blur px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden lg:block">
        <Logo collapsed imageOnly className="opacity-75" />
      </div>

      <div className="relative hidden w-full max-w-sm md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients, doctors, appointments..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 focus:bg-white transition-colors"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted lg:flex">
          <Calendar className="size-4" />
          {today}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex size-9 items-center justify-center rounded-lg text-muted hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-danger-500 ring-2 ring-white" />
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-[scaleIn_0.12s_ease-out]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">Notifications</p>
                  {unreadCount > 0 && <Badge variant="danger">{unreadCount} new</Badge>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <button
                      type="button"
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn(
                        'flex w-full gap-2.5 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50',
                        !n.read && 'bg-primary-50/40',
                      )}
                    >
                      <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-primary-600')} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{n.title}</p>
                        <p className="line-clamp-1 text-xs text-muted">{n.message}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{timeAgo(n.time)}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false)
                    navigate('/notifications')
                  }}
                  className="block w-full border-t border-slate-100 py-2.5 text-center text-sm font-medium text-primary-600 hover:bg-slate-50"
                >
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        {user && (
          <DropdownMenu
            trigger={
              <span className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-slate-100">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="text-sm font-semibold text-ink">{user.name}</span>
                  <span className="text-xs capitalize text-muted">{user.role}</span>
                </span>
                <ChevronDown className="hidden size-4 text-muted sm:block" />
              </span>
            }
            items={[
              { label: 'My Profile', icon: <User className="size-4" />, onClick: () => navigate('/profile') },
              { label: 'Settings', icon: <Settings className="size-4" />, onClick: () => navigate('/settings') },
              { label: 'Logout', icon: <LogOut className="size-4" />, onClick: handleLogout, danger: true },
            ]}
          />
        )}
      </div>
    </header>
  )
}
