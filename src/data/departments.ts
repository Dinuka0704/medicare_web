import type { Department } from '@/types'

export const departments: Department[] = [
  { id: 'dep-1', name: 'Cardiology', description: 'Heart & cardiovascular care', patientCount: 184 },
  { id: 'dep-2', name: 'Dermatology', description: 'Skin, hair & nail care', patientCount: 96 },
  { id: 'dep-3', name: 'General Medicine', description: 'General physician consultations', patientCount: 312 },
  { id: 'dep-4', name: 'Neurology', description: 'Brain & nervous system', patientCount: 78 },
  { id: 'dep-5', name: 'Orthopedics', description: 'Bones, joints & muscles', patientCount: 145 },
  { id: 'dep-6', name: 'Pediatrics', description: 'Child healthcare', patientCount: 210 },
  { id: 'dep-7', name: 'Gynecology', description: "Women's health", patientCount: 132 },
  { id: 'dep-8', name: 'ENT', description: 'Ear, nose & throat', patientCount: 64 },
]

export const departmentNames = departments.map((d) => d.name)
