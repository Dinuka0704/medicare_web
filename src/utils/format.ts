export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// A bare 'YYYY-MM-DD' string is parsed by `new Date()` as UTC midnight, but
// then rendered in the viewer's local timezone — in any positive UTC offset
// that silently rolls the displayed date back by one day. Every date-only
// string in this app's data is a calendar date with no time-of-day meaning,
// so it must be parsed from local components, never through the UTC path.
function parseCalendarDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toDate(date: string | Date): Date {
  if (typeof date !== 'string') return date
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? parseCalendarDate(date) : new Date(date)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(toDate(date))
}

export function formatDateLong(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toDate(date))
}

export function formatTime(time: string): string {
  return time
}

export function getAge(dob: string): number {
  const birth = parseCalendarDate(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}
