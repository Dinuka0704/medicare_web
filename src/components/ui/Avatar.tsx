import { useState } from 'react'
import { getInitials } from '@/utils/format'
import { cn } from '@/utils/cn'

export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline'

interface AvatarProps {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: AvatarStatus
  className?: string
}

const sizeClasses = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
  xl: 'size-20 text-xl',
}

const statusClasses: Record<AvatarStatus, string> = {
  online: 'bg-success-500',
  busy: 'bg-danger-500',
  away: 'bg-warning-500',
  offline: 'bg-slate-400',
}

const statusSizeClasses = {
  xs: 'size-1.5',
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3',
  xl: 'size-4',
}

export function Avatar({ src, name, size = 'md', status, className }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const showImage = src && !errored

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setErrored(true)}
          className={cn('rounded-full object-cover ring-2 ring-white', sizeClasses[size])}
        />
      ) : (
        <span
          className={cn(
            'flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 ring-2 ring-white',
            sizeClasses[size],
          )}
        >
          {getInitials(name)}
        </span>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusClasses[status],
            statusSizeClasses[size],
          )}
        />
      )}
    </span>
  )
}
