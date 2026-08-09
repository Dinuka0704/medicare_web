import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export type StatTone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: ReactNode
  tone?: StatTone
  change?: { value: string; direction: 'up' | 'down' }
  subtitle?: string
  className?: string
}

const toneClasses: Record<StatTone, string> = {
  primary: 'bg-primary-50 text-primary-600',
  secondary: 'bg-secondary-50 text-secondary-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
}

export function StatCard({ label, value, icon, tone = 'primary', change, subtitle, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink tabular-nums">{value}</p>
        </div>
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}>
          {icon}
        </div>
      </div>
      {(change || subtitle) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium',
                change.direction === 'up' ? 'text-success-600' : 'text-danger-600',
              )}
            >
              {change.direction === 'up' ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {change.value}
            </span>
          )}
          {subtitle && <span className="text-muted">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
