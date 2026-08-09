import { Outlet } from 'react-router-dom'
import { ShieldCheck, Activity, Users2, CalendarClock } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

const highlights = [
  { icon: Users2, text: 'Manage patients, doctors and staff from one dashboard' },
  { icon: CalendarClock, text: 'Streamline appointments and reduce waiting times' },
  { icon: Activity, text: 'Track hospital performance with real-time insights' },
  { icon: ShieldCheck, text: 'Role-based access keeps patient data secure' },
]

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-24 -top-24 size-96 rounded-full border-[40px] border-white" />
          <div className="absolute -bottom-32 -right-16 size-96 rounded-full border-[40px] border-white" />
        </div>

        <div className="relative">
          <Logo light />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">
            Modern hospital management, built for busy healthcare teams.
          </h2>
          <p className="mt-3 max-w-md text-primary-100">
            Medicare brings patients, doctors, appointments and billing together in a single, easy-to-use system.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <h.icon className="size-4.5" />
                </span>
                <p className="text-sm text-primary-50">{h.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-primary-100">© 2026 Medicare Hospital Management System</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
