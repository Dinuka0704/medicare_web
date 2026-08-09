import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { DateInput } from '@/components/ui/DateInput'
import { TagInput } from '@/components/ui/TagInput'
import { Button } from '@/components/ui/Button'
import type { Patient, Gender, BloodGroup } from '@/types'

export interface PatientFormValues {
  firstName: string
  lastName: string
  dob: string
  gender: Gender | ''
  nic: string
  bloodGroup: BloodGroup | ''
  phone: string
  email: string
  address: string
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string
}

interface PatientFormProps {
  initialData?: Patient
  onSubmit: (values: PatientFormValues & { allergies: string[]; conditions: string[]; medications: string[] }) => void
  submitLabel?: string
  submitting?: boolean
}

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((v) => ({ value: v, label: v }))

export function PatientForm({ initialData, onSubmit, submitLabel = 'Save Patient', submitting }: PatientFormProps) {
  const [allergies, setAllergies] = useState<string[]>(initialData?.allergies ?? [])
  const [conditions, setConditions] = useState<string[]>(initialData?.conditions ?? [])
  const [medications, setMedications] = useState<string[]>(initialData?.medications ?? [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      dob: initialData?.dob ?? '',
      gender: initialData?.gender ?? '',
      nic: initialData?.nic ?? '',
      bloodGroup: initialData?.bloodGroup ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      address: initialData?.address ?? '',
      emergencyName: initialData?.emergencyContact.name ?? '',
      emergencyRelationship: initialData?.emergencyContact.relationship ?? '',
      emergencyPhone: initialData?.emergencyContact.phone ?? '',
    },
  })

  const submit = (values: PatientFormValues) => {
    onSubmit({ ...values, allergies, conditions, medications })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Personal Information" description="Basic identity details of the patient" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="First Name" required error={errors.firstName?.message} {...register('firstName', { required: 'First name is required' })} />
          <Input label="Last Name" required error={errors.lastName?.message} {...register('lastName', { required: 'Last name is required' })} />
          <DateInput label="Date of Birth" required error={errors.dob?.message} {...register('dob', { required: 'Date of birth is required' })} />
          <Select
            label="Gender"
            required
            options={genderOptions}
            placeholder="Select gender"
            error={errors.gender?.message}
            {...register('gender', { required: 'Gender is required' })}
          />
          <Input label="NIC / ID Number" required error={errors.nic?.message} {...register('nic', { required: 'NIC / ID number is required' })} />
          <Select
            label="Blood Group"
            required
            options={bloodGroupOptions}
            placeholder="Select blood group"
            error={errors.bloodGroup?.message}
            {...register('bloodGroup', { required: 'Blood group is required' })}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Contact Information" description="How to reach the patient" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone Number"
            required
            placeholder="+94 7X XXX XXXX"
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone number is required' })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            })}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Address"
              required
              rows={2}
              error={errors.address?.message}
              {...register('address', { required: 'Address is required' })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Emergency Contact" description="Who to contact in case of an emergency" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Contact Name"
            required
            error={errors.emergencyName?.message}
            {...register('emergencyName', { required: 'Emergency contact name is required' })}
          />
          <Input
            label="Relationship"
            required
            placeholder="e.g. Spouse, Parent"
            error={errors.emergencyRelationship?.message}
            {...register('emergencyRelationship', { required: 'Relationship is required' })}
          />
          <Input
            label="Contact Phone"
            required
            error={errors.emergencyPhone?.message}
            {...register('emergencyPhone', { required: 'Emergency contact phone is required' })}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Medical Information" description="Known allergies, conditions and current medication" />
        <div className="grid grid-cols-1 gap-4">
          <TagInput
            label="Allergies"
            value={allergies}
            onChange={setAllergies}
            placeholder="Type an allergy and press Enter"
            tagVariant="danger"
            hint="Press Enter or comma to add"
          />
          <TagInput
            label="Existing Conditions"
            value={conditions}
            onChange={setConditions}
            placeholder="Type a condition and press Enter"
            hint="Press Enter or comma to add"
          />
          <TagInput
            label="Current Medication"
            value={medications}
            onChange={setMedications}
            placeholder="Type a medication and press Enter"
            hint="Press Enter or comma to add"
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" loading={submitting} icon={<Save className="size-4" />}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
