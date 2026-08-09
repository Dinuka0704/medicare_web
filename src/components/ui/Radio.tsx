import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, id, ...rest }, ref) => {
    const radioId = id ?? `${rest.name ?? 'radio'}-${label?.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <label htmlFor={radioId} className={cn('flex items-start gap-2.5 cursor-pointer group', className)}>
        <span className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input ref={ref} id={radioId} type="radio" className="peer sr-only" {...rest} />
          <span
            className={cn(
              'size-[18px] rounded-full border border-slate-300 bg-white transition-colors',
              'peer-checked:border-primary-600 peer-checked:border-[5px]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600/30',
              'peer-disabled:bg-slate-100 peer-disabled:cursor-not-allowed',
            )}
          />
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
Radio.displayName = 'Radio'
