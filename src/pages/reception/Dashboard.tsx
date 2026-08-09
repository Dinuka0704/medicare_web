import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Users,
  UserPlus,
  Wallet,
  Stethoscope,
  ClipboardCheck,
  Receipt,
  UserCheck2,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { getPatientFullName } from '@/data/patients'
import { TODAY } from '@/data/appointments'
import { formatCurrency, formatDateLong } from '@/utils/format'
import { invoiceGrandTotal } from '@/utils/calculations'

const quickActions = [
  { label: 'Register Patient', icon: UserPlus, to: '/patients/new' },
  { label: 'Book Appointment', icon: CalendarCheck, to: '/appointments/new' },
  { label: 'Check-In Patient', icon: UserCheck2, to: '/queue' },
  { label: 'Create Invoice', icon: Receipt, to: '/billing/new' },
]

export default function ReceptionDashboard() {
  const { user } = useAuth()
  const { appointments, patients, doctors, invoices } = useData()

  const todaysAppointments = appointments.filter((a) => a.date === TODAY)
  const waitingPatients = todaysAppointments.filter((a) => a.status === 'Waiting')
  const newRegistrations = [...patients]
    .sort((a, b) => (a.registeredDate < b.registeredDate ? 1 : -1))
    .slice(0, 5)
  const pendingPayments = invoices.filter((i) => i.status === 'Pending' || i.status === 'Partial')
  const availableDoctors = doctors.filter((d) => d.status === 'Available')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Welcome, ${user?.name.split(' ')[0]}`} description={formatDateLong(TODAY)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Today's Appointments" value={todaysAppointments.length} icon={<CalendarCheck className="size-5" />} tone="primary" />
        <StatCard label="Waiting Patients" value={waitingPatients.length} icon={<Users className="size-5" />} tone="warning" />
        <StatCard label="New Registrations" value={newRegistrations.length} icon={<UserPlus className="size-5" />} tone="secondary" />
        <StatCard label="Pending Payments" value={pendingPayments.length} icon={<Wallet className="size-5" />} tone="danger" />
        <StatCard label="Available Doctors" value={availableDoctors.length} icon={<Stethoscope className="size-5" />} tone="success" />
      </div>

      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 px-3 py-4 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/50"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <action.icon className="size-5" />
              </span>
              <span className="text-xs font-medium text-ink">{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      <Card padding="none">
        <div className="flex items-center justify-between px-5 pt-5">
          <CardHeader title="Today's Appointment Queue" description={`${todaysAppointments.length} appointments`} className="mb-0" />
          <Link to="/queue" className="mb-4 text-sm font-medium text-primary-600 hover:text-primary-700">
            Open Queue
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todaysAppointments.slice(0, 6).map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId)
                const doctor = doctors.find((d) => d.id === apt.doctorId)
                if (!patient || !doctor) return null
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="sm" />
                        <span className="font-medium text-ink">{getPatientFullName(patient)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink">{doctor.name}</td>
                    <td className="px-5 py-3 text-muted">{apt.time}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recently Registered Patients"
            action={
              <Link to="/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          <div className="flex flex-col divide-y divide-slate-100">
            {newRegistrations.map((p) => (
              <Link key={p.id} to={`/patients/${p.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg">
                <Avatar src={p.avatar} name={getPatientFullName(p)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{getPatientFullName(p)}</p>
                  <p className="text-xs text-muted">Registered {formatDateLong(p.registeredDate)}</p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Doctor Availability"
            action={
              <Link to="/doctors" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          <div className="flex flex-col divide-y divide-slate-100">
            {doctors.slice(0, 5).map((doc) => (
              <Link key={doc.id} to={`/doctors/${doc.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg">
                <Avatar src={doc.avatar} name={doc.name} size="sm" status={doc.status === 'Available' ? 'online' : doc.status === 'Busy' ? 'busy' : 'away'} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{doc.name}</p>
                  <p className="text-xs text-muted">{doc.specialization}</p>
                </div>
                <StatusBadge status={doc.status} />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="px-5 pt-5">
          <CardHeader title="Pending Payments" description={`${pendingPayments.length} invoices awaiting payment`} />
        </div>
        {pendingPayments.length === 0 ? (
          <div className="flex items-center gap-2 px-5 pb-5 text-sm text-muted">
            <ClipboardCheck className="size-4 text-success-600" /> All payments are up to date.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingPayments.slice(0, 5).map((inv) => {
              const patient = patients.find((p) => p.id === inv.patientId)
              return (
                <Link key={inv.id} to={`/billing/${inv.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-ink">{patient ? getPatientFullName(patient) : '—'}</p>
                    <p className="text-xs text-muted">{inv.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-ink">{formatCurrency(invoiceGrandTotal(inv))}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
