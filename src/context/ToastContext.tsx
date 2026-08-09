import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  description?: string
}

interface ToastContextValue {
  show: (variant: ToastVariant, title: string, description?: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const variantConfig: Record<ToastVariant, { classes: string; icon: ReactNode }> = {
  success: { classes: 'border-success-200 bg-white', icon: <CheckCircle2 className="size-5 text-success-600" /> },
  error: { classes: 'border-danger-200 bg-white', icon: <XCircle className="size-5 text-danger-600" /> },
  warning: { classes: 'border-warning-200 bg-white', icon: <AlertTriangle className="size-5 text-warning-600" /> },
  info: { classes: 'border-secondary-200 bg-white', icon: <Info className="size-5 text-secondary-600" /> },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((prev) => [...prev, { id, variant, title, description }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const value: ToastContextValue = {
    show,
    success: (title, description) => show('success', title, description),
    error: (title, description) => show('error', title, description),
    warning: (title, description) => show('warning', title, description),
    info: (title, description) => show('info', title, description),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
          {toasts.map((toast) => {
            const config = variantConfig[toast.variant]
            return (
              <div
                key={toast.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border shadow-lg px-4 py-3 animate-[toastIn_0.2s_ease-out]',
                  config.classes,
                )}
              >
                <span className="shrink-0 mt-0.5">{config.icon}</span>
                <div className="grow min-w-0">
                  <p className="text-sm font-semibold text-ink">{toast.title}</p>
                  {toast.description && <p className="text-xs text-muted mt-0.5">{toast.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 text-muted hover:text-ink"
                  aria-label="Dismiss notification"
                >
                  <X className="size-4" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
