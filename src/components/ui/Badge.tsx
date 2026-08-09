import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-ink',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-secondary-50 text-secondary-700',
  neutral: 'bg-slate-100 text-muted',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  primary: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-600',
  danger: 'bg-danger-600',
  info: 'bg-secondary-600',
  neutral: 'bg-slate-400',
}

export function Badge({ children, variant = 'default', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dotClasses[variant])} />}
      {children}
    </span>
  )
}
