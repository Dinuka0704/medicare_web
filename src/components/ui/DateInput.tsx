import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, hint, required, className, id, ...rest }, ref) => {
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
          <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              'h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-ink',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600',
              'disabled:bg-slate-50 disabled:text-muted disabled:cursor-not-allowed',
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
DateInput.displayName = 'DateInput'
