import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  side?: 'left' | 'right'
  width?: string
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'max-w-md' }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-slate-900/50 animate-[fadeIn_0.15s_ease-out]" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative flex h-full w-full flex-col bg-white shadow-xl animate-[slideInRight_0.2s_ease-out]',
          width,
          side === 'right' ? 'ml-auto' : 'mr-auto',
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 shrink-0">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-ink transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto grow px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
