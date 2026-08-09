import type { ReactNode } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  CalendarDays,
  Clock,
  DoorOpen,
  Stethoscope,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Droplet,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { useConfirm } from '@/context/ConfirmContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { getPatientFullName } from '@/data/patients'
import { formatDate } from '@/utils/format'
import type { AppointmentStatus } from '@/types'

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const toast = useToast()
  const { user } = useAuth()
  const { appointments, patients, doctors, updateAppointment } = useData()

  const appointment = appointments.find((a) => a.id === id)

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment not found"
        description="This appointment may have been removed."
        action={<Button onClick={() => navigate('/appointments')}>Back to Appointments</Button>}
      />
    )
  }

  const patient = patients.find((p) => p.id === appointment.patientId)
  const doctor = doctors.find((d) => d.id === appointment.doctorId)

  const setStatus = (status: AppointmentStatus) => {
    updateAppointment(appointment.id, { status })
    toast.success('Appointment updated', `Status changed to ${status}.`)
  }

  const handleCancel = async () => {
    const ok = await confirm({
      title: 'Cancel this appointment?',
      description: 'The patient and doctor will need to reschedule. This action cannot be undone.',
      confirmLabel: 'Cancel Appointment',
      danger: true,
    })
    if (ok) setStatus('Cancelled')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={appointment.id}
        description="Appointment details and status"
        breadcrumbs={[{ label: 'Appointments', to: '/appointments' }, { label: appointment.id }]}
        actions={
          <>
            {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
              <>
                {appointment.status !== 'Confirmed' && (
                  <Button variant="outline" icon={<CheckCircle2 className="size-4" />} onClick={() => setStatus('Confirmed')}>
                    Confirm
                  </Button>
                )}
                <Button variant="outline" className="text-danger-600 hover:bg-danger-50" icon={<XCircle className="size-4" />} onClick={handleCancel}>
                  Cancel
                </Button>
                {user?.role === 'doctor' && (
                  <Link to={`/doctor/consultation/${appointment.id}`}>
                    <Button icon={<Stethoscope className="size-4" />}>Start Consultation</Button>
                  </Link>
                )}
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Appointment Information" action={<StatusBadge status={appointment.status} />} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={<CalendarDays className="size-4" />} label="Date" value={formatDate(appointment.date)} />
            <InfoRow icon={<Clock className="size-4" />} label="Time" value={appointment.time} />
            <InfoRow icon={<DoorOpen className="size-4" />} label="Room" value={appointment.room} />
            <InfoRow icon={<Stethoscope className="size-4" />} label="Department" value={appointment.department} />
            <InfoRow icon={<ClipboardList className="size-4" />} label="Visit Type" value={appointment.visitType} />
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Reason for Visit</p>
            <p className="mt-1 text-sm text-ink">{appointment.reason}</p>
          </div>
          {appointment.notes && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Additional Notes</p>
              <p className="mt-1 text-sm text-ink">{appointment.notes}</p>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          {patient && (
            <Card>
              <CardHeader title="Patient" />
              <Link to={`/patients/${patient.id}`} className="flex items-center gap-3">
                <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="md" />
                <div>
                  <p className="font-medium text-ink hover:text-primary-600">{getPatientFullName(patient)}</p>
                  <p className="text-xs text-muted">{patient.id}</p>
                </div>
              </Link>
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {patient.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {patient.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplet className="size-3.5" /> {patient.bloodGroup}
                </span>
              </div>
            </Card>
          )}

          {doctor && (
            <Card>
              <CardHeader title="Doctor" />
              <Link to={`/doctors/${doctor.id}`} className="flex items-center gap-3">
                <Avatar src={doctor.avatar} name={doctor.name} size="md" />
                <div>
                  <p className="font-medium text-ink hover:text-primary-600">{doctor.name}</p>
                  <p className="text-xs text-muted">{doctor.specialization}</p>
                </div>
              </Link>
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {doctor.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {doctor.email}
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  )
}
