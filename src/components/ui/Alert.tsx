import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}

const variantConfig: Record<AlertVariant, { classes: string; icon: ReactNode }> = {
  info: { classes: 'bg-secondary-50 text-secondary-700 border-secondary-200', icon: <Info className="size-5" /> },
  success: { classes: 'bg-success-50 text-success-700 border-success-200', icon: <CheckCircle2 className="size-5" /> },
  warning: { classes: 'bg-warning-50 text-warning-700 border-warning-200', icon: <AlertTriangle className="size-5" /> },
  danger: { classes: 'bg-danger-50 text-danger-700 border-danger-200', icon: <XCircle className="size-5" /> },
}

export function Alert({ variant = 'info', title, children, onClose, className }: AlertProps) {
  const config = variantConfig[variant]
  return (
    <div className={cn('flex items-start gap-3 rounded-lg border px-4 py-3', config.classes, className)}>
      <span className="shrink-0 mt-0.5">{config.icon}</span>
      <div className="grow text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
