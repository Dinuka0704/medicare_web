import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'

const statusVariantMap: Record<string, BadgeVariant> = {
  // Appointment
  Scheduled: 'info',
  Confirmed: 'primary',
  Waiting: 'warning',
  Completed: 'success',
  Cancelled: 'danger',
  // Patient / Doctor
  Active: 'success',
  Inactive: 'neutral',
  Critical: 'danger',
  Available: 'success',
  Busy: 'warning',
  'On Leave': 'neutral',
  // Payment
  Paid: 'success',
  Pending: 'warning',
  Partial: 'info',
  // Queue
  Called: 'primary',
  'In Consultation': 'info',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] ?? 'default'
  return (
    <Badge variant={variant} dot className={className}>
      {status}
    </Badge>
  )
}
