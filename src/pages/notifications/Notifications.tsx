import { useMemo, useState } from 'react'
import { Bell, CalendarCheck, Wallet, Users, FileText, Settings, CheckCheck } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { timeAgo } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { AppNotification, NotificationType } from '@/types'

const typeIcons: Record<NotificationType, typeof Bell> = {
  appointment: CalendarCheck,
  payment: Wallet,
  patient: Users,
  report: FileText,
  system: Settings,
}

const typeColors: Record<NotificationType, string> = {
  appointment: 'bg-primary-50 text-primary-600',
  payment: 'bg-success-50 text-success-600',
  patient: 'bg-secondary-50 text-secondary-600',
  report: 'bg-warning-50 text-warning-600',
  system: 'bg-slate-100 text-slate-600',
}

type FilterValue = 'all' | 'unread' | 'read'

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData()
  const [filter, setFilter] = useState<FilterValue>('all')

  const filtered = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => (a.time < b.time ? 1 : -1))
    if (filter === 'unread') return sorted.filter((n) => !n.read)
    if (filter === 'read') return sorted.filter((n) => n.read)
    return sorted
  }, [notifications, filter])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Stay updated on appointments, payments and hospital activity."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" icon={<CheckCheck className="size-4" />} onClick={markAllNotificationsRead}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 self-start">
        {(['all', 'unread', 'read'] as FilterValue[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              filter === f ? 'bg-white text-ink shadow-sm' : 'text-muted',
            )}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && <span className="ml-1.5 text-xs text-primary-600">({unreadCount})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Bell className="size-6" />} title="No notifications" description="You're all caught up." />
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-slate-100">
            {filtered.map((n: AppNotification) => {
              const Icon = typeIcons[n.type]
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className={cn('flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50', !n.read && 'bg-primary-50/30')}
                >
                  <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', typeColors[n.type])}>
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{n.title}</p>
                      {!n.read && <span className="size-1.5 rounded-full bg-primary-600" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{n.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{timeAgo(n.time)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
