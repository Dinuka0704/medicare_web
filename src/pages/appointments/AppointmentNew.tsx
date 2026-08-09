import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarCheck, Clock } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { DateInput } from '@/components/ui/DateInput'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { departmentNames } from '@/data/departments'
import { timeSlotsByDoctor } from '@/data/appointments'
import { generateId } from '@/utils/id'
import { cn } from '@/utils/cn'
import type { Appointment, VisitType } from '@/types'

interface AppointmentFormValues {
  patientId: string
  department: string
  doctorId: string
  date: string
  room: string
  visitType: VisitType | ''
  reason: string
  notes: string
}

const visitTypes: VisitType[] = ['New Visit', 'Follow-up', 'Consultation', 'Emergency']
const rooms = ['Room 101', 'Room 112', 'Room 204', 'Room 210', 'Room 305', 'Room 308', 'Room 402', 'Room 501']

export default function AppointmentNew() {
  const { patients, doctors, addAppointment } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedSlot, setSelectedSlot] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    defaultValues: {
      patientId: searchParams.get('patientId') ?? '',
      department: '',
      doctorId: '',
      date: '2026-08-10',
      room: '',
      visitType: '',
      reason: '',
      notes: '',
    },
  })

  const department = watch('department')
  const doctorId = watch('doctorId')

  const availableDoctors = useMemo(
    () => (department ? doctors.filter((d) => d.department === department) : doctors),
    [doctors, department],
  )

  const availableSlots = doctorId ? (timeSlotsByDoctor[doctorId] ?? []) : []

  const submit = (values: AppointmentFormValues) => {
    if (!selectedSlot) {
      toast.warning('Select a time slot', 'Please choose an available time slot to continue.')
      return
    }
    setSubmitting(true)
    const appointment: Appointment = {
      id: generateId('APT'),
      patientId: values.patientId,
      doctorId: values.doctorId,
      department: values.department,
      date: values.date,
      time: selectedSlot,
      room: values.room,
      status: 'Scheduled',
      visitType: values.visitType as VisitType,
      reason: values.reason,
      notes: values.notes || undefined,
    }
    setTimeout(() => {
      addAppointment(appointment)
      setSubmitting(false)
      toast.success('Appointment booked', `Scheduled for ${values.date} at ${selectedSlot}.`)
      navigate('/appointments')
    }, 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Book Appointment"
        description="Schedule a new patient appointment."
        breadcrumbs={[{ label: 'Appointments', to: '/appointments' }, { label: 'Book Appointment' }]}
      />

      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-6">
        <Card>
          <CardHeader title="Appointment Details" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Patient"
              required
              placeholder="Select patient"
              options={patients.map((p) => ({ value: p.id, label: `${getPatientFullName(p)} (${p.id})` }))}
              error={errors.patientId?.message}
              {...register('patientId', { required: 'Please select a patient' })}
            />
            <Select
              label="Department"
              required
              placeholder="Select department"
              options={departmentNames.map((d) => ({ value: d, label: d }))}
              error={errors.department?.message}
              {...register('department', { required: 'Please select a department' })}
            />
            <Select
              label="Doctor"
              required
              placeholder="Select doctor"
              options={availableDoctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialization}` }))}
              error={errors.doctorId?.message}
              {...register('doctorId', { required: 'Please select a doctor' })}
            />
            <DateInput
              label="Appointment Date"
              required
              min="2026-08-09"
              error={errors.date?.message}
              {...register('date', { required: 'Please select a date' })}
            />
            <Select
              label="Room"
              required
              placeholder="Select room"
              options={rooms.map((r) => ({ value: r, label: r }))}
              error={errors.room?.message}
              {...register('room', { required: 'Please select a room' })}
            />
            <Select
              label="Visit Type"
              required
              placeholder="Select visit type"
              options={visitTypes.map((v) => ({ value: v, label: v }))}
              error={errors.visitType?.message}
              {...register('visitType', { required: 'Please select a visit type' })}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Available Time Slots"
            description={doctorId ? 'Select an available slot for the chosen doctor' : 'Select a doctor to view available time slots'}
          />
          {doctorId ? (
            availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                      selectedSlot === slot
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-ink hover:border-slate-300 hover:bg-slate-50',
                    )}
                  >
                    <Clock className="size-3.5" />
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No available slots for this doctor.</p>
            )
          ) : (
            <p className="text-sm text-muted">Please select a doctor above to see their available time slots.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Visit Information" />
          <div className="flex flex-col gap-4">
            <Input
              label="Reason for Visit"
              required
              placeholder="e.g. Routine checkup, follow-up consultation"
              error={errors.reason?.message}
              {...register('reason', { required: 'Please provide a reason for the visit' })}
            />
            <Textarea label="Additional Notes" rows={3} placeholder="Any additional information for the doctor..." {...register('notes')} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg" loading={submitting} icon={<CalendarCheck className="size-4" />}>
            Book Appointment
          </Button>
        </div>
      </form>
    </div>
  )
}
