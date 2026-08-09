import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Trash2, Printer, Save, Pill } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { formatDate, getAge } from '@/utils/format'
import { generateId } from '@/utils/id'
import type { Prescription } from '@/types'

interface PrescriptionFormValues {
  patientId: string
  doctorId: string
  diagnosis: string
  notes: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }[]
}

export default function NewPrescription() {
  const { patients, doctors, addPrescription } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState<Prescription | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<PrescriptionFormValues>({
    defaultValues: {
      patientId: searchParams.get('patientId') ?? '',
      doctorId: searchParams.get('doctorId') ?? '',
      diagnosis: searchParams.get('diagnosis') ?? '',
      notes: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'medications' })

  const patientId = watch('patientId')
  const doctorId = watch('doctorId')
  const patient = patients.find((p) => p.id === patientId)
  const doctor = doctors.find((d) => d.id === doctorId)

  const submit = (values: PrescriptionFormValues) => {
    setSubmitting(true)
    const prescription: Prescription = {
      id: generateId('RX'),
      patientId: values.patientId,
      doctorId: values.doctorId,
      diagnosis: values.diagnosis,
      date: '2026-08-09',
      notes: values.notes || undefined,
      medications: values.medications.map((m) => ({ id: generateId('MED'), ...m })),
    }
    setTimeout(() => {
      addPrescription(prescription)
      setSubmitting(false)
      setPreview(prescription)
      toast.success('Prescription created', 'The prescription has been saved to the patient record.')
    }, 400)
  }

  if (preview) {
    return <PrescriptionPreview prescription={preview} onDone={() => navigate('/prescriptions/new')} />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Prescription" description="Create a prescription for a patient." />

      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-6">
        <Card>
          <CardHeader title="Prescription Details" />
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
              label="Doctor"
              required
              placeholder="Select doctor"
              options={doctors.map((d) => ({ value: d.id, label: d.name }))}
              error={errors.doctorId?.message}
              {...register('doctorId', { required: 'Please select a doctor' })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Diagnosis"
                required
                placeholder="e.g. Essential Hypertension"
                error={errors.diagnosis?.message}
                {...register('diagnosis', { required: 'Diagnosis is required' })}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Medications" description="Add one or more medications to this prescription" />
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Medication {index + 1}</p>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex size-7 items-center justify-center rounded-lg text-muted hover:bg-danger-50 hover:text-danger-600"
                      aria-label="Remove medication"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="Medication Name"
                    required
                    placeholder="e.g. Amoxicillin"
                    error={errors.medications?.[index]?.name?.message}
                    {...register(`medications.${index}.name`, { required: 'Required' })}
                  />
                  <Input
                    label="Dosage"
                    required
                    placeholder="e.g. 500mg"
                    error={errors.medications?.[index]?.dosage?.message}
                    {...register(`medications.${index}.dosage`, { required: 'Required' })}
                  />
                  <Input
                    label="Frequency"
                    required
                    placeholder="e.g. Twice daily"
                    error={errors.medications?.[index]?.frequency?.message}
                    {...register(`medications.${index}.frequency`, { required: 'Required' })}
                  />
                  <Input
                    label="Duration"
                    required
                    placeholder="e.g. 7 days"
                    error={errors.medications?.[index]?.duration?.message}
                    {...register(`medications.${index}.duration`, { required: 'Required' })}
                  />
                  <div className="sm:col-span-2 lg:col-span-4">
                    <Input label="Instructions" placeholder="e.g. Take after meals" {...register(`medications.${index}.instructions`)} />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="size-4" />}
              onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' })}
              className="self-start"
            >
              Add Medication
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Additional Notes" />
          <Textarea placeholder="Any additional instructions for the patient or pharmacist..." {...register('notes')} />
        </Card>

        {patient && doctor && (
          <Card className="bg-slate-50">
            <p className="text-sm text-muted">
              Prescribing for <span className="font-medium text-ink">{getPatientFullName(patient)}</span> by{' '}
              <span className="font-medium text-ink">{doctor.name}</span>
            </p>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg" loading={submitting} icon={<Pill className="size-4" />}>
            Create Prescription
          </Button>
        </div>
      </form>
    </div>
  )
}

function PrescriptionPreview({ prescription, onDone }: { prescription: Prescription; onDone: () => void }) {
  const { patients, doctors } = useData()
  const patient = patients.find((p) => p.id === prescription.patientId)
  const doctor = doctors.find((d) => d.id === prescription.doctorId)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Prescription Created"
        description="Review and print the prescription below."
        actions={
          <>
            <Button variant="outline" onClick={onDone} icon={<Save className="size-4" />}>
              New Prescription
            </Button>
            <Button onClick={() => window.print()} icon={<Printer className="size-4" />}>
              Print
            </Button>
          </>
        }
      />

      <div className="print-area mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:border-none print:shadow-none">
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <Logo />
          <div className="text-right text-xs text-muted">
            <p className="font-semibold text-ink">Medicare Hospital</p>
            <p>No. 45, Hospital Road, Colombo 05</p>
            <p>+94 11 234 5678</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Patient</p>
            <p className="font-medium text-ink">{patient ? getPatientFullName(patient) : '—'}</p>
            {patient && <p className="text-xs text-muted">{patient.id} · {getAge(patient.dob)} yrs · {patient.gender}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Date</p>
            <p className="font-medium text-ink">{formatDate(prescription.date)}</p>
            <p className="text-xs text-muted">Rx ID: {prescription.id}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Prescribing Doctor</p>
            <p className="font-medium text-ink">{doctor?.name}</p>
            <p className="text-xs text-muted">{doctor?.specialization}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Diagnosis</p>
            <p className="font-medium text-ink">{prescription.diagnosis}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="mb-3 text-4xl font-serif text-primary-600">℞</p>
          <div className="flex flex-col gap-4">
            {prescription.medications.map((m, i) => (
              <div key={m.id} className="flex gap-3">
                <span className="font-semibold text-ink">{i + 1}.</span>
                <div>
                  <p className="font-medium text-ink">
                    {m.name} — {m.dosage}
                  </p>
                  <p className="text-sm text-muted">
                    {m.frequency} · {m.duration}
                  </p>
                  {m.instructions && <p className="text-sm text-muted italic">{m.instructions}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {prescription.notes && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Notes</p>
            <p className="mt-1 text-sm text-ink">{prescription.notes}</p>
          </div>
        )}

        <div className="mt-10 flex items-end justify-between">
          <p className="text-xs text-muted">This is a digitally generated prescription from Medicare HMS.</p>
          <div className="text-center">
            <div className="mb-1 h-10 w-32 border-b border-slate-400" />
            <p className="text-xs text-muted">Doctor's Signature</p>
          </div>
        </div>
      </div>
    </div>
  )
}
