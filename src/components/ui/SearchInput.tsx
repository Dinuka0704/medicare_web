import type { InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export function SearchInput({ value, onChange, onClear, className, containerClassName, placeholder = 'Search...', ...rest }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 text-sm text-ink placeholder:text-slate-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600',
          className,
        )}
        {...rest}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => (onClear ? onClear() : onChange(''))}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
