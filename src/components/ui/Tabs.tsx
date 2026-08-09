import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TabItem {
  value: string
  label: string
  count?: number
  icon?: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-slate-200', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
              active ? 'text-primary-600' : 'text-muted hover:text-ink',
            )}
          >
            {tab.icon}
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  active ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-muted',
                )}
              >
                {tab.count}
              </span>
            )}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary-600" />}
          </button>
        )
      })}
    </div>
  )
}
