import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Users,
  Clock,
  CheckCircle2,
  CalendarClock,
  Stethoscope,
  FileText,
  Pill,
  Bell,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { getPatientFullName } from '@/data/patients'
import { TODAY } from '@/data/appointments'
import { formatDateLong, timeAgo } from '@/utils/format'

const quickActions = [
  { label: 'View Schedule', icon: CalendarClock, to: '/appointments' },
  { label: 'Patient Records', icon: Users, to: '/patients' },
  { label: 'Medical Records', icon: FileText, to: '/medical-records' },
  { label: 'Create Prescription', icon: Pill, to: '/prescriptions/new' },
]

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { appointments, patients, notifications } = useData()

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id)
  const todaysAppointments = myAppointments
    .filter((a) => a.date === TODAY)
    .sort((a, b) => (a.time > b.time ? 1 : -1))
  const waitingPatients = todaysAppointments.filter((a) => a.status === 'Waiting')
  const completedToday = todaysAppointments.filter((a) => a.status === 'Completed')
  const pendingConsultations = todaysAppointments.filter((a) => a.status !== 'Completed' && a.status !== 'Cancelled')
  const upcoming = myAppointments.filter((a) => a.date > TODAY).sort((a, b) => (a.date > b.date ? 1 : -1))

  const uniquePatientIds = new Set(todaysAppointments.map((a) => a.patientId))
  const recentPatients = patients
    .filter((p) => myAppointments.some((a) => a.patientId === p.id))
    .slice(0, 5)

  const myNotifications = notifications.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome, ${user?.name}`}
        description={formatDateLong(TODAY)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Appointments" value={todaysAppointments.length} icon={<CalendarCheck className="size-5" />} tone="primary" />
        <StatCard label="Patients Today" value={uniquePatientIds.size} icon={<Users className="size-5" />} tone="secondary" />
        <StatCard label="Pending Consultations" value={pendingConsultations.length} icon={<Clock className="size-5" />} tone="warning" />
        <StatCard label="Completed Consultations" value={completedToday.length} icon={<CheckCircle2 className="size-5" />} tone="success" />
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card padding="none" className="lg:col-span-2">
          <div className="px-5 pt-5">
            <CardHeader title="Today's Schedule" description={`${todaysAppointments.length} appointments scheduled`} />
          </div>
          {todaysAppointments.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-muted">No appointments scheduled for today.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {todaysAppointments.map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId)
                if (!patient) return null
                return (
                  <div key={apt.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="w-16 shrink-0 text-sm font-semibold text-ink">{apt.time}</span>
                    <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{getPatientFullName(patient)}</p>
                      <p className="text-xs text-muted">{apt.reason}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                    {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                      <Link to={`/doctor/consultation/${apt.id}`}>
                        <Button size="sm" variant="outline" icon={<Stethoscope className="size-3.5" />}>
                          Start
                        </Button>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Waiting Patients" description={`${waitingPatients.length} in queue`} />
            {waitingPatients.length === 0 ? (
              <p className="text-sm text-muted">No patients waiting right now.</p>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {waitingPatients.map((apt) => {
                  const patient = patients.find((p) => p.id === apt.patientId)
                  if (!patient) return null
                  return (
                    <div key={apt.id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                      <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{getPatientFullName(patient)}</p>
                        <p className="text-xs text-muted">{apt.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Upcoming" description="Next scheduled appointments" />
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">No upcoming appointments.</p>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {upcoming.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-sm">
                    <span className="text-ink">{apt.date}</span>
                    <span className="text-muted">{apt.time}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent Patients"
            action={
              <Link to="/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          {recentPatients.length === 0 ? (
            <p className="text-sm text-muted">No recent patients.</p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {recentPatients.map((p) => (
                <Link key={p.id} to={`/patients/${p.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg">
                  <Avatar src={p.avatar} name={getPatientFullName(p)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{getPatientFullName(p)}</p>
                    <p className="text-xs text-muted">{p.id}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Notifications"
            action={
              <Link to="/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            }
          />
          <div className="flex flex-col gap-3">
            {myNotifications.map((n) => (
              <div key={n.id} className="flex gap-2.5">
                <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Bell className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink">{n.title}</p>
                  <p className="text-xs text-muted">{timeAgo(n.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
