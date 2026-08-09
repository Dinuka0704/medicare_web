import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...rest }, ref) => {
    const checkboxId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <label htmlFor={checkboxId} className={cn('flex items-start gap-2.5 cursor-pointer group', className)}>
        <span className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input ref={ref} id={checkboxId} type="checkbox" className="peer sr-only" {...rest} />
          <span
            className={cn(
              'size-[18px] rounded border border-slate-300 bg-white transition-colors',
              'peer-checked:bg-primary-600 peer-checked:border-primary-600',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600/30',
              'peer-disabled:bg-slate-100 peer-disabled:cursor-not-allowed',
            )}
          />
          <Check className="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && <span className="text-sm text-ink">{label}</span>}
            {description && <span className="text-xs text-muted">{description}</span>}
          </span>
        )}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'
