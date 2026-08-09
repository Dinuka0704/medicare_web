import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, rows = 4, ...rest }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-ink">
            {label}
            {required && <span className="text-danger-600 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600',
            'disabled:bg-slate-50 disabled:text-muted disabled:cursor-not-allowed',
            error ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/20' : 'border-slate-300',
            className,
          )}
          {...rest}
        />
        {error ? (
          <p className="text-xs text-danger-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
