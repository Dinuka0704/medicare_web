import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  AlertTriangle,
  Pill,
  Save,
  FileSignature,
  FlaskConical,
  CheckCircle2,
  Droplet,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { DateInput } from '@/components/ui/DateInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { formatDate, getAge } from '@/utils/format'
import { generateId } from '@/utils/id'

export default function Consultation() {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { appointments, patients, medicalRecords, addMedicalRecord, updateAppointment } = useData()

  const appointment = appointments.find((a) => a.id === appointmentId)
  const patient = appointment ? patients.find((p) => p.id === appointment.patientId) : undefined

  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [treatment, setTreatment] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [saving, setSaving] = useState(false)

  if (!appointment || !patient) {
    return (
      <EmptyState
        title="Consultation not found"
        description="This appointment doesn't exist or has no associated patient."
        action={<Button onClick={() => navigate('/appointments')}>Back to Appointments</Button>}
      />
    )
  }

  const previousVisits = medicalRecords
    .filter((r) => r.patientId === patient.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const handleSaveNotes = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Notes saved', 'Consultation notes have been saved to the patient record.')
    }, 400)
  }

  const handleRequestLabTest = () => {
    addMedicalRecord({
      id: generateId('REC'),
      patientId: patient.id,
      doctorId: appointment.doctorId,
      type: 'Lab Report',
      title: 'Lab Test Requested',
      date: '2026-08-09',
      summary: `Lab test requested during consultation. Symptoms: ${symptoms || 'N/A'}.`,
      attachments: [],
    })
    toast.info('Lab test requested', 'The laboratory has been notified. Results will appear in Lab Reports.')
  }

  const handleComplete = () => {
    if (diagnosis.trim()) {
      addMedicalRecord({
        id: generateId('REC'),
        patientId: patient.id,
        doctorId: appointment.doctorId,
        type: 'Consultation',
        title: `Consultation - ${diagnosis}`,
        date: '2026-08-09',
        summary: clinicalNotes || `Diagnosis: ${diagnosis}. Treatment: ${treatment || 'N/A'}.`,
        attachments: [],
      })
    }
    updateAppointment(appointment.id, { status: 'Completed' })
    toast.success('Consultation completed', `${getPatientFullName(patient)}'s consultation has been marked complete.`)
    navigate('/doctor/dashboard')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Consultation"
        description={`${appointment.date} · ${appointment.time} · ${appointment.reason}`}
        breadcrumbs={[{ label: 'Appointments', to: '/appointments' }, { label: 'Consultation' }]}
        actions={<StatusBadge status={appointment.status} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card>
            <Link to={`/patients/${patient.id}`} className="flex flex-col items-center text-center gap-2">
              <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="xl" />
              <p className="font-semibold text-ink hover:text-primary-600">{getPatientFullName(patient)}</p>
              <p className="text-xs text-muted">{patient.id}</p>
            </Link>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-lg bg-slate-50 py-2">
                <p className="text-xs text-muted">Age</p>
                <p className="font-semibold text-ink">{getAge(patient.dob)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 py-2">
                <p className="flex items-center justify-center gap-1 text-xs text-muted">
                  <Droplet className="size-3" /> Blood
                </p>
                <p className="font-semibold text-ink">{patient.bloodGroup}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Allergies" className="mb-3" />
            {patient.allergies.length === 0 ? (
              <p className="text-sm text-muted">No known allergies.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map((a) => (
                  <Badge key={a} variant="danger">
                    <AlertTriangle className="size-3" /> {a}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Existing Conditions" className="mb-3" />
            {patient.conditions.length === 0 ? (
              <p className="text-sm text-muted">None reported.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {patient.conditions.map((c) => (
                  <Badge key={c} variant="warning">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Current Medication" className="mb-3" />
            {patient.medications.length === 0 ? (
              <p className="text-sm text-muted">No active medication.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {patient.medications.map((m) => (
                  <div key={m} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-ink">
                    <Pill className="size-3.5 text-primary-600" /> {m}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader title="Consultation Notes" description="Document findings for this visit" />
            <div className="flex flex-col gap-4">
              <Textarea label="Symptoms" rows={3} placeholder="Describe the patient's reported symptoms..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
              <Textarea label="Diagnosis" rows={2} placeholder="Clinical diagnosis..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
              <Textarea label="Clinical Notes" rows={4} placeholder="Detailed clinical observations..." value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} />
              <Textarea label="Treatment" rows={3} placeholder="Recommended treatment plan..." value={treatment} onChange={(e) => setTreatment(e.target.value)} />
              <DateInput label="Follow-Up Date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" icon={<Save className="size-4" />} loading={saving} onClick={handleSaveNotes}>
              Save Notes
            </Button>
            <Link to={`/prescriptions/new?patientId=${patient.id}&doctorId=${appointment.doctorId}&diagnosis=${encodeURIComponent(diagnosis)}`}>
              <Button variant="outline" icon={<FileSignature className="size-4" />}>
                Create Prescription
              </Button>
            </Link>
            <Button variant="outline" icon={<FlaskConical className="size-4" />} onClick={handleRequestLabTest}>
              Request Lab Test
            </Button>
            <Button icon={<CheckCircle2 className="size-4" />} onClick={handleComplete} className="ml-auto">
              Complete Consultation
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card>
            <CardHeader title="Previous Visits" description={`${previousVisits.length} records`} />
            {previousVisits.length === 0 ? (
              <p className="text-sm text-muted">No previous visits on record.</p>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {previousVisits.slice(0, 6).map((v) => (
                  <div key={v.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{v.title}</p>
                    </div>
                    <p className="text-xs text-muted">{formatDate(v.date)}</p>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{v.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
