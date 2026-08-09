import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PatientForm } from '@/components/patients/PatientForm'
import type { PatientFormValues } from '@/components/patients/PatientForm'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { generateId } from '@/utils/id'
import type { Patient } from '@/types'

const TODAY = '2026-08-09'

export default function PatientNew() {
  const { addPatient } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (
    values: PatientFormValues & { allergies: string[]; conditions: string[]; medications: string[] },
  ) => {
    setSubmitting(true)
    const id = generateId('PT')
    const patient: Patient = {
      id,
      firstName: values.firstName,
      lastName: values.lastName,
      dob: values.dob,
      gender: values.gender as Patient['gender'],
      nic: values.nic,
      bloodGroup: values.bloodGroup as Patient['bloodGroup'],
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
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      status: 'Active',
      lastVisit: TODAY,
      registeredDate: TODAY,
    }

    setTimeout(() => {
      addPatient(patient)
      setSubmitting(false)
      toast.success('Patient registered', `${values.firstName} ${values.lastName} has been added successfully.`)
      navigate(`/patients/${id}`)
    }, 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Patient"
        description="Register a new patient into the Medicare system."
        breadcrumbs={[{ label: 'Patients', to: '/patients' }, { label: 'Add Patient' }]}
      />
      <PatientForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Register Patient" />
    </div>
  )
}
