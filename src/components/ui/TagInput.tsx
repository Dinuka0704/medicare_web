import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TagInputProps {
  label?: string
  hint?: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  tagVariant?: 'default' | 'danger'
}

export function TagInput({ label, hint, value, onChange, placeholder, tagVariant = 'default' }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-ink">{label}</label>}
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-600/20">
        {value.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
              tagVariant === 'danger' ? 'bg-danger-50 text-danger-700' : 'bg-primary-50 text-primary-700',
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="opacity-70 hover:opacity-100"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-none bg-transparent py-1 text-sm text-ink placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
