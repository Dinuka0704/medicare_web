import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PhoneCall, Send, CheckCircle2, UserCheck2, ListOrdered } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { TODAY } from '@/data/appointments'
import { generateId } from '@/utils/id'
import type { QueueStatus } from '@/types'

const CURRENT_TIME = '11:15 AM'

export default function Queue() {
  const { appointments, patients, doctors, queueEntries, addQueueEntry, updateQueueEntry } = useData()
  const toast = useToast()

  const todaysAppointments = appointments.filter((a) => a.date === TODAY && a.status !== 'Cancelled')
  const checkedInIds = new Set(queueEntries.map((q) => q.patientId + q.doctorId))
  const notCheckedIn = todaysAppointments.filter((a) => !checkedInIds.has(a.patientId + a.doctorId))

  const sortedQueue = useMemo(
    () => [...queueEntries].sort((a, b) => a.queueNumber - b.queueNumber),
    [queueEntries],
  )

  const handleCheckIn = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId)
    if (!apt) return
    const nextNumber = queueEntries.length > 0 ? Math.max(...queueEntries.map((q) => q.queueNumber)) + 1 : 1
    addQueueEntry({
      id: generateId('Q'),
      queueNumber: nextNumber,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      appointmentTime: apt.time,
      arrivalTime: CURRENT_TIME,
      status: 'Waiting',
    })
    const patient = patients.find((p) => p.id === apt.patientId)
    toast.success('Patient checked in', `${patient ? getPatientFullName(patient) : 'Patient'} added to the queue.`)
  }

  const handleStatusChange = (id: string, status: QueueStatus) => {
    updateQueueEntry(id, { status })
    toast.info('Queue updated', `Status changed to ${status}.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reception Queue" description="Manage today's patient check-ins and consultation flow." />

      {notCheckedIn.length > 0 && (
        <Card>
          <CardHeader title="Awaiting Check-In" description="Today's scheduled patients who haven't checked in yet" />
          <div className="flex flex-col gap-2">
            {notCheckedIn.map((apt) => {
              const patient = patients.find((p) => p.id === apt.patientId)
              const doctor = doctors.find((d) => d.id === apt.doctorId)
              if (!patient || !doctor) return null
              return (
                <div key={apt.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-ink">{getPatientFullName(patient)}</p>
                      <p className="text-xs text-muted">
                        {doctor.name} · {apt.time}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" icon={<UserCheck2 className="size-3.5" />} onClick={() => handleCheckIn(apt.id)}>
                    Check In
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Card padding="none">
        <div className="px-5 pt-5">
          <CardHeader title="Current Queue" description={`${sortedQueue.length} patients in the system today`} />
        </div>
        {sortedQueue.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<ListOrdered className="size-6" />} title="No patients in queue" description="Check in a patient above to add them to the queue." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Appt. Time</th>
                  <th className="px-5 py-3">Arrival</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedQueue.map((q) => {
                  const patient = patients.find((p) => p.id === q.patientId)
                  const doctor = doctors.find((d) => d.id === q.doctorId)
                  if (!patient || !doctor) return null
                  return (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-ink">{q.queueNumber}</td>
                      <td className="px-5 py-3">
                        <Link to={`/patients/${patient.id}`} className="flex items-center gap-2.5 hover:text-primary-600">
                          <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="sm" />
                          <span className="font-medium text-ink">{getPatientFullName(patient)}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-ink">{doctor.name}</td>
                      <td className="px-5 py-3 text-muted">{q.appointmentTime}</td>
                      <td className="px-5 py-3 text-muted">{q.arrivalTime}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          {q.status === 'Waiting' && (
                            <Button size="sm" variant="outline" icon={<PhoneCall className="size-3.5" />} onClick={() => handleStatusChange(q.id, 'Called')}>
                              Call
                            </Button>
                          )}
                          {q.status === 'Called' && (
                            <Button size="sm" variant="outline" icon={<Send className="size-3.5" />} onClick={() => handleStatusChange(q.id, 'In Consultation')}>
                              Send to Doctor
                            </Button>
                          )}
                          {q.status === 'In Consultation' && (
                            <Button size="sm" icon={<CheckCircle2 className="size-3.5" />} onClick={() => handleStatusChange(q.id, 'Completed')}>
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
