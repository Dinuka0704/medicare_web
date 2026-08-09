import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Phone,
  Mail,
  Star,
  Award,
  Clock,
  Users,
  CalendarCheck,
  Wallet,
  GraduationCap,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { StatCard } from '@/components/ui/StatCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { useData } from '@/context/DataContext'
import { getPatientFullName } from '@/data/patients'
import { formatCurrency, formatDate } from '@/utils/format'

const statusMap = { Available: 'online', Busy: 'busy', 'On Leave': 'away' } as const

const tabs: TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'patients', label: 'Patients' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'performance', label: 'Performance' },
]

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { doctors, patients, appointments } = useData()
  const [activeTab, setActiveTab] = useState('overview')

  const doctor = doctors.find((d) => d.id === id)
  const doctorAppointments = useMemo(
    () => appointments.filter((a) => a.doctorId === id).sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1)),
    [appointments, id],
  )
  const doctorPatients = useMemo(() => {
    const ids = new Set(doctorAppointments.map((a) => a.patientId))
    return patients.filter((p) => ids.has(p.id))
  }, [doctorAppointments, patients])

  const monthlyTrend = useMemo(() => {
    if (!doctor) return []
    const base = Math.max(doctor.todayAppointments * 4, 8)
    return ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => ({
      month,
      consultations: Math.round(base + Math.sin(i + doctor.name.length) * 6 + i * 2),
    }))
  }, [doctor])

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        description="This doctor profile doesn't exist."
        action={<Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Doctor Profile"
        breadcrumbs={[{ label: 'Doctors', to: '/doctors' }, { label: doctor.name }]}
        actions={
          <Link to="/appointments/new">
            <Button icon={<CalendarCheck className="size-4" />}>Book Appointment</Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar src={doctor.avatar} name={doctor.name} size="xl" status={statusMap[doctor.status]} />
          <div>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h2 className="text-xl font-bold text-ink">{doctor.name}</h2>
              <StatusBadge status={doctor.status} />
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {doctor.specialization} · {doctor.department}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5" /> {doctor.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> {doctor.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-warning-500 text-warning-500" /> {doctor.rating} rating
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="About" />
            <p className="text-sm leading-relaxed text-muted">{doctor.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.qualifications.map((q) => (
                <span key={q} className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  <GraduationCap className="size-3.5" /> {q}
                </span>
              ))}
            </div>
          </Card>
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600">
                  <Award className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted">Experience</p>
                  <p className="text-sm font-semibold text-ink">{doctor.experienceYears} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-success-50 text-success-600">
                  <Wallet className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted">Consultation Fee</p>
                  <p className="text-sm font-semibold text-ink">{formatCurrency(doctor.consultationFee)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Users className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted">Total Patients</p>
                  <p className="text-sm font-semibold text-ink">{doctor.totalPatients.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <Card>
          <CardHeader title="Weekly Schedule" description="Consultation hours by day" />
          {doctor.schedule.length === 0 ? (
            <p className="text-sm text-muted">No schedule configured.</p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {doctor.schedule.map((slot) => (
                <div key={slot.day} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="font-medium text-ink">{slot.day}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <Clock className="size-3.5" />
                    {slot.start} – {slot.end}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'patients' && (
        <Card padding="none">
          {doctorPatients.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={<Users className="size-6" />} title="No patients yet" description="This doctor has no associated patients." />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {doctorPatients.map((p) => (
                <Link key={p.id} to={`/patients/${p.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
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
      )}

      {activeTab === 'appointments' && (
        <Card padding="none">
          {doctorAppointments.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={<CalendarCheck className="size-6" />} title="No appointments" description="No appointments recorded for this doctor." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctorAppointments.map((apt) => {
                    const patient = patients.find((p) => p.id === apt.patientId)
                    return (
                      <tr key={apt.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/appointments/${apt.id}`)}>
                        <td className="px-5 py-3 font-medium text-ink">{patient ? getPatientFullName(patient) : '—'}</td>
                        <td className="px-5 py-3 text-muted">{formatDate(apt.date)}</td>
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
          )}
        </Card>
      )}

      {activeTab === 'performance' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Patients" value={doctor.totalPatients.toLocaleString()} icon={<Users className="size-5" />} tone="primary" />
            <StatCard label="Today's Appointments" value={doctor.todayAppointments} icon={<CalendarCheck className="size-5" />} tone="success" />
            <StatCard label="Average Rating" value={doctor.rating} icon={<Star className="size-5" />} tone="warning" />
            <StatCard label="Experience" value={`${doctor.experienceYears} yrs`} icon={<Award className="size-5" />} tone="secondary" />
          </div>
          <Card>
            <CardHeader title="Consultation Trend" description="Monthly consultations over the last 6 months" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={36} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip formatter={(v) => `${v} consultations`} />} />
                <Bar dataKey="consultations" name="Consultations" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  )
}
