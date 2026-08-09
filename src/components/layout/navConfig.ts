import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Stethoscope,
  FileText,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  ListOrdered,
  Pill,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export function getDashboardPath(role: Role): string {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'doctor') return '/doctor/dashboard'
  return '/reception/dashboard'
}

export function getNavItems(role: Role): NavItem[] {
  const dashboard: NavItem = { label: 'Dashboard', to: getDashboardPath(role), icon: LayoutDashboard }

  if (role === 'admin') {
    return [
      dashboard,
      { label: 'Patients', to: '/patients', icon: Users },
      { label: 'Doctors', to: '/doctors', icon: Stethoscope },
      { label: 'Appointments', to: '/appointments', icon: CalendarCheck },
      { label: 'Medical Records', to: '/medical-records', icon: FileText },
      { label: 'Billing', to: '/billing', icon: Receipt },
      { label: 'Reports', to: '/reports', icon: BarChart3 },
      { label: 'Notifications', to: '/notifications', icon: Bell },
      { label: 'Settings', to: '/settings', icon: Settings },
    ]
  }

  if (role === 'receptionist') {
    return [
      dashboard,
      { label: 'Patients', to: '/patients', icon: Users },
      { label: 'Appointments', to: '/appointments', icon: CalendarCheck },
      { label: 'Queue', to: '/queue', icon: ListOrdered },
      { label: 'Billing', to: '/billing', icon: Receipt },
      { label: 'Doctors', to: '/doctors', icon: Stethoscope },
      { label: 'Notifications', to: '/notifications', icon: Bell },
    ]
  }

  return [
    dashboard,
    { label: 'Appointments', to: '/appointments', icon: CalendarCheck },
    { label: 'Patients', to: '/patients', icon: Users },
    { label: 'Medical Records', to: '/medical-records', icon: FileText },
    { label: 'Prescriptions', to: '/prescriptions/new', icon: Pill },
    { label: 'Notifications', to: '/notifications', icon: Bell },
  ]
}
