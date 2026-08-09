import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PatientForm } from '@/components/patients/PatientForm'
import type { PatientFormValues } from '@/components/patients/PatientForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { UserX } from 'lucide-react'

export default function PatientEdit() {
  const { id } = useParams<{ id: string }>()
  const { patients, updatePatient } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const patient = patients.find((p) => p.id === id)

  if (!patient) {
    return (
      <EmptyState
        icon={<UserX className="size-6" />}
        title="Patient not found"
        description="This patient record may have been removed."
        action={<Button onClick={() => navigate('/patients')}>Back to Patients</Button>}
      />
    )
  }

  const handleSubmit = (
    values: PatientFormValues & { allergies: string[]; conditions: string[]; medications: string[] },
  ) => {
    setSubmitting(true)
    setTimeout(() => {
      updatePatient(patient.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        dob: values.dob,
        gender: values.gender as typeof patient.gender,
        nic: values.nic,
        bloodGroup: values.bloodGroup as typeof patient.bloodGroup,
        phone: values.phone,
        email: values.email,
        address: values.address,
        emergencyContact: {
          name: values.emergencyName,
          relationship: values.emergencyRelationship,
          phone: values.emergencyPhone,
        },
        allergies: values.allergies,
        conditions: values.conditions,
        medications: values.medications,
      })
      setSubmitting(false)
      toast.success('Patient updated', `${values.firstName} ${values.lastName}'s record has been updated.`)
      navigate(`/patients/${patient.id}`)
    }, 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${getPatientFullName(patient)}`}
        description="Update patient information."
        breadcrumbs={[
          { label: 'Patients', to: '/patients' },
          { label: getPatientFullName(patient), to: `/patients/${patient.id}` },
          { label: 'Edit' },
        ]}
      />
      <PatientForm initialData={patient} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save Changes" />
    </div>
  )
}
