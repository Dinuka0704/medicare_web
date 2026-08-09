import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, required, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {required && <span className="text-danger-600 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-slate-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600',
              'disabled:bg-slate-50 disabled:text-muted disabled:cursor-not-allowed',
              icon && 'pl-9',
              error ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/20' : 'border-slate-300',
              className,
            )}
            {...rest}
          />
        </div>
        {error ? (
          <p className="text-xs text-danger-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
