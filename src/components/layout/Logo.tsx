import { cn } from '@/utils/cn'

interface LogoProps {
  collapsed?: boolean
  light?: boolean
  className?: string
  imageOnly?: boolean
}

export function Logo({ collapsed = false, light = false, className, imageOnly = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src="/MedicaRe.png"
        alt="Medicare"
        className={cn('shrink-0', imageOnly || collapsed ? 'size-9' : 'size-10')}
      />
      {!collapsed && !imageOnly && (
        <span className="flex flex-col leading-none">
          <span className={cn('text-lg font-bold tracking-tight', light ? 'text-white' : 'text-ink')}>
            Medicare
          </span>
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-wider',
              light ? 'text-primary-100' : 'text-muted',
            )}
          >
            Hospital System
          </span>
        </span>
      )}
    </div>
  )
}
