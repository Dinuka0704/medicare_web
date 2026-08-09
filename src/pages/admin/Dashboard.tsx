import { Link } from 'react-router-dom'
import { Users, Stethoscope, CalendarCheck, Clock, Wallet, UserCheck, ArrowRight, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/Button'
import { AppointmentsBarChart } from '@/components/charts/AppointmentsBarChart'
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart'
import { PatientDistributionChart } from '@/components/charts/PatientDistributionChart'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { getPatientFullName } from '@/data/patients'
import { TODAY } from '@/data/appointments'
import { activityLog } from '@/data/activity'
import { formatCurrency, formatDate, getInitials, timeAgo } from '@/utils/format'
import { invoiceGrandTotal } from '@/utils/calculations'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { patients, doctors, appointments, invoices } = useData()

  const todaysAppointments = appointments.filter((a) => a.date === TODAY)
  const pendingAppointments = appointments.filter((a) => a.status === 'Scheduled' || a.status === 'Waiting')
  const availableDoctors = doctors.filter((d) => d.status === 'Available')
  const monthRevenue = invoices
    .filter((i) => i.date.startsWith('2026-08') && i.status !== 'Cancelled')
    .reduce((sum, i) => sum + invoiceGrandTotal(i), 0)

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime())
    .slice(0, 5)

  const recentPayments = [...invoices]
    .filter((i) => i.status === 'Paid')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name.split(' ')[0]}. Here's what's happening at Medicare today.`}
        actions={
          <>
            <Link to="/patients/new">
              <Button variant="outline" icon={<Plus className="size-4" />}>
                Add Patient
              </Button>
            </Link>
            <Link to="/appointments/new">
              <Button icon={<Plus className="size-4" />}>Book Appointment</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Patients"
          value={patients.length}
          icon={<Users className="size-5" />}
          tone="primary"
          change={{ value: '+12.4%', direction: 'up' }}
          subtitle="vs last month"
        />
        <StatCard
          label="Doctors"
          value={doctors.length}
          icon={<Stethoscope className="size-5" />}
          tone="secondary"
          subtitle={`${availableDoctors.length} available now`}
        />
        <StatCard
          label="Today's Appointments"
          value={todaysAppointments.length}
          icon={<CalendarCheck className="size-5" />}
          tone="success"
          change={{ value: '+5.1%', direction: 'up' }}
          subtitle="vs yesterday"
        />
        <StatCard
          label="Pending Appointments"
          value={pendingAppointments.length}
          icon={<Clock className="size-5" />}
          tone="warning"
          subtitle="Awaiting confirmation"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(monthRevenue)}
          icon={<Wallet className="size-5" />}
          tone="success"
          change={{ value: '+8.2%', direction: 'up' }}
          subtitle="vs last month"
        />
        <StatCard
          label="Available Doctors"
          value={availableDoctors.length}
          icon={<UserCheck className="size-5" />}
          tone="primary"
          subtitle={`out of ${doctors.length} total`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Appointments Overview" description="Weekly appointment volume, Monday to Sunday" />
          <AppointmentsBarChart />
        </Card>
        <Card>
          <CardHeader title="Patient Distribution" description="By gender" />
          <PatientDistributionChart />
        </Card>
      </div>

      <Card>
        <CardHeader title="Revenue Overview" description="Monthly hospital income (last 7 months)" />
        <RevenueAreaChart />
      </Card>

      <Card padding="none">
        <div className="flex items-center justify-between px-5 pt-5">
          <CardHeader title="Today's Appointments" description={formatDate(TODAY)} className="mb-0" />
          <Link to="/appointments" className="mb-4 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Room</th>
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
                    <td className="px-5 py-3 text-muted">{apt.room}</td>
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
            title="Recent Patients"
            description="Newly registered patients"
            action={
              <Link to="/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          <div className="flex flex-col divide-y divide-slate-100">
            {recentPatients.map((p) => (
              <Link
                key={p.id}
                to={`/patients/${p.id}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg"
              >
                <Avatar src={p.avatar} name={getPatientFullName(p)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{getPatientFullName(p)}</p>
                  <p className="text-xs text-muted">
                    {p.id} · Registered {formatDate(p.registeredDate)}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent Payments"
            description="Latest completed transactions"
            action={
              <Link to="/billing" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          <div className="flex flex-col divide-y divide-slate-100">
            {recentPayments.map((inv) => {
              const patient = patients.find((p) => p.id === inv.patientId)
              return (
                <div key={inv.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-50 text-xs font-semibold text-success-700">
                    {patient ? getInitials(getPatientFullName(patient)) : '—'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {patient ? getPatientFullName(patient) : 'Unknown patient'}
                    </p>
                    <p className="text-xs text-muted">
                      {inv.id} · {formatDate(inv.date)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-success-600">{formatCurrency(invoiceGrandTotal(inv))}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Doctor Availability"
            description="Current status across departments"
            action={
              <Link to="/doctors" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          <div className="flex flex-col divide-y divide-slate-100">
            {doctors.slice(0, 5).map((doc) => (
              <Link
                key={doc.id}
                to={`/doctors/${doc.id}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg"
              >
                <Avatar
                  src={doc.avatar}
                  name={doc.name}
                  size="sm"
                  status={doc.status === 'Available' ? 'online' : doc.status === 'Busy' ? 'busy' : 'away'}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{doc.name}</p>
                  <p className="text-xs text-muted">{doc.specialization}</p>
                </div>
                <StatusBadge status={doc.status} />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="System Activity" description="Latest actions across the hospital" />
          <div className="flex flex-col gap-4">
            {activityLog.slice(0, 6).map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
                <div className="min-w-0">
                  <p className="text-sm text-ink">
                    <span className="font-medium">{entry.actor}</span> {entry.action}
                  </p>
                  <p className="text-xs text-muted">{timeAgo(entry.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
