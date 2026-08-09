import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  CalendarDays,
  Table2,
  ChevronLeft,
  ChevronRight,
  Eye,
  XCircle,
  CheckCircle2,
  CalendarX2,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { DateInput } from '@/components/ui/DateInput'
import { Table } from '@/components/ui/Table'
import type { Column } from '@/components/ui/Table'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { departmentNames } from '@/data/departments'
import type { Appointment } from '@/types'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'

const statusOptions = ['Scheduled', 'Confirmed', 'Waiting', 'Completed', 'Cancelled']

// Date-only strings are parsed and re-serialized using local calendar fields
// throughout (never toISOString/`new Date(dateOnlyString)`), so this never
// drifts a day depending on the viewer's timezone offset from UTC.
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfWeek(dateStr: string): Date {
  const d = parseLocalDate(dateStr)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function toISODate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AppointmentList() {
  const { appointments, patients, doctors, updateAppointment } = useData()
  const toast = useToast()
  const navigate = useNavigate()

  const [view, setView] = useState<'table' | 'calendar'>('table')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [weekAnchor, setWeekAnchor] = useState('2026-08-09')

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      return (
        (!doctorFilter || a.doctorId === doctorFilter) &&
        (!departmentFilter || a.department === departmentFilter) &&
        (!statusFilter || a.status === statusFilter) &&
        (!dateFilter || a.date === dateFilter)
      )
    })
  }, [appointments, doctorFilter, departmentFilter, statusFilter, dateFilter])

  const sorted = [...filtered].sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1))

  const handleStatusChange = (apt: Appointment, status: Appointment['status']) => {
    updateAppointment(apt.id, { status })
    toast.success('Appointment updated', `Status changed to ${status}.`)
  }

  const weekStart = startOfWeek(weekAnchor)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const shiftWeek = (days: number) => {
    const d = parseLocalDate(weekAnchor)
    d.setDate(d.getDate() + days)
    setWeekAnchor(toISODate(d))
  }

  const columns: Column<Appointment>[] = [
    { key: 'id', header: 'Appointment ID', render: (a) => <span className="font-medium text-ink">{a.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      render: (a) => {
        const patient = patients.find((p) => p.id === a.patientId)
        if (!patient) return '—'
        return (
          <div className="flex items-center gap-2.5">
            <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="sm" />
            <span className="font-medium text-ink">{getPatientFullName(patient)}</span>
          </div>
        )
      },
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (a) => doctors.find((d) => d.id === a.doctorId)?.name ?? '—',
    },
    { key: 'department', header: 'Department', render: (a) => a.department },
    { key: 'date', header: 'Date', render: (a) => formatDate(a.date) },
    { key: 'time', header: 'Time', render: (a) => a.time },
    { key: 'room', header: 'Room', render: (a) => a.room },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/appointments/${a.id}`}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-primary-600"
            aria-label="View appointment"
          >
            <Eye className="size-4" />
          </Link>
          <DropdownMenu
            trigger={
              <span className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100">
                <CheckCircle2 className="size-4" />
              </span>
            }
            items={[
              { label: 'Confirm', icon: <CheckCircle2 className="size-4" />, onClick: () => handleStatusChange(a, 'Confirmed') },
              { label: 'Mark Completed', icon: <CheckCircle2 className="size-4" />, onClick: () => handleStatusChange(a, 'Completed') },
              { label: 'Cancel Appointment', icon: <XCircle className="size-4" />, onClick: () => handleStatusChange(a, 'Cancelled'), danger: true },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Appointments"
        description="Manage and track patient appointments."
        actions={
          <Link to="/appointments/new">
            <Button icon={<Plus className="size-4" />}>Book Appointment</Button>
          </Link>
        }
      />

      <Card padding="sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex-1">
            <Select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              options={doctors.map((d) => ({ value: d.id, label: d.name }))}
              placeholder="Doctor"
            />
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={departmentNames.map((d) => ({ value: d, label: d }))}
              placeholder="Department"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions.map((s) => ({ value: s, label: s }))}
              placeholder="Status"
            />
            <DateInput value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setView('table')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === 'table' ? 'bg-white text-ink shadow-sm' : 'text-muted',
              )}
            >
              <Table2 className="size-4" /> Table
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === 'calendar' ? 'bg-white text-ink shadow-sm' : 'text-muted',
              )}
            >
              <CalendarDays className="size-4" /> Calendar
            </button>
          </div>
        </div>
      </Card>

      {view === 'table' ? (
        sorted.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CalendarX2 className="size-6" />}
              title="No appointments found"
              description="Try adjusting your filters or book a new appointment."
              action={
                <Link to="/appointments/new">
                  <Button icon={<Plus className="size-4" />}>Book Appointment</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <Table columns={columns} data={sorted} keyField="id" onRowClick={(a) => navigate(`/appointments/${a.id}`)} />
        )
      ) : (
        <Card padding="sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">
              {formatDate(toISODate(weekDays[0]))} — {formatDate(toISODate(weekDays[6]))}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => shiftWeek(-7)} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100">
                <ChevronLeft className="size-4" />
              </button>
              <button type="button" onClick={() => setWeekAnchor('2026-08-09')} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50">
                Today
              </button>
              <button type="button" onClick={() => shiftWeek(7)} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {weekDays.map((day) => {
              const iso = toISODate(day)
              const dayAppointments = filtered
                .filter((a) => a.date === iso)
                .sort((a, b) => (a.time > b.time ? 1 : -1))
              const isToday = iso === '2026-08-09'
              return (
                <div key={iso} className={cn('rounded-lg border p-2.5', isToday ? 'border-primary-300 bg-primary-50/40' : 'border-slate-200')}>
                  <p className={cn('mb-2 text-xs font-semibold uppercase', isToday ? 'text-primary-700' : 'text-muted')}>
                    {day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {dayAppointments.length === 0 && <p className="text-xs text-slate-400">No appointments</p>}
                    {dayAppointments.map((a) => {
                      const patient = patients.find((p) => p.id === a.patientId)
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => navigate(`/appointments/${a.id}`)}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-left text-xs shadow-sm hover:border-primary-300 hover:shadow"
                        >
                          <p className="font-semibold text-ink">{a.time}</p>
                          <p className="truncate text-muted">{patient ? getPatientFullName(patient) : 'Unknown'}</p>
                          <StatusBadge status={a.status} className="mt-1" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
