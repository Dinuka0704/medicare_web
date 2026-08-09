import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmOptions {
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<(value: boolean) => void>(undefined)

  const confirm: ConfirmFn = useCallback((opts) => {
    setOptions(opts)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const handleClose = (result: boolean) => {
    resolver.current?.(result)
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={options !== null}
        onClose={() => handleClose(false)}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => handleClose(false)}>
              {options?.cancelLabel ?? 'Cancel'}
            </Button>
            <Button variant={options?.danger ? 'danger' : 'primary'} onClick={() => handleClose(true)}>
              {options?.confirmLabel ?? 'Confirm'}
            </Button>
          </>
        }
      >
        {options && (
          <div className="flex items-start gap-3">
            <span
              className={
                options.danger
                  ? 'flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger-600'
                  : 'flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600'
              }
            >
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <p className="text-base font-semibold text-ink">{options.title}</p>
              {options.description && <p className="mt-1 text-sm text-muted">{options.description}</p>}
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}
