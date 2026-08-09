import type { Prescription } from '@/types'

export const prescriptions: Prescription[] = [
  {
    id: 'RX-5001',
    patientId: 'PT-1001',
    doctorId: 'DOC-001',
    diagnosis: 'Essential Hypertension',
    date: '2026-08-02',
    medications: [
      { id: 'MED-1', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning with water' },
    ],
    notes: 'Monitor blood pressure weekly and report readings above 150/95.',
  },
  {
    id: 'RX-5002',
    patientId: 'PT-1003',
    doctorId: 'DOC-001',
    diagnosis: 'Type 2 Diabetes Mellitus with Hyperlipidemia',
    date: '2026-08-08',
    medications: [
      { id: 'MED-1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take after meals' },
      { id: 'MED-2', name: 'Atorvastatin', dosage: '10mg', frequency: 'Once at night', duration: '90 days', instructions: 'Take at bedtime' },
    ],
    notes: 'Recheck HbA1c and lipid panel in 3 months.',
  },
  {
    id: 'RX-5003',
    patientId: 'PT-1004',
    doctorId: 'DOC-006',
    diagnosis: 'Mild Persistent Asthma',
    date: '2026-07-28',
    medications: [
      { id: 'MED-1', name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As needed', duration: '30 days', instructions: 'Two puffs for acute symptoms, max 4 times a day' },
    ],
    notes: 'Review inhaler technique at next visit.',
  },
  {
    id: 'RX-5004',
    patientId: 'PT-1009',
    doctorId: 'DOC-004',
    diagnosis: 'Chronic Migraine',
    date: '2026-07-15',
    medications: [
      { id: 'MED-1', name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days', instructions: 'Take at onset of migraine, max 2 tablets in 24 hours' },
      { id: 'MED-2', name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '60 days', instructions: 'For migraine prevention' },
    ],
  },
  {
    id: 'RX-5005',
    patientId: 'PT-1014',
    doctorId: 'DOC-003',
    diagnosis: 'Iron Deficiency Anemia',
    date: '2026-07-25',
    medications: [
      { id: 'MED-1', name: 'Ferrous Sulfate', dosage: '325mg', frequency: 'Once daily', duration: '60 days', instructions: 'Take on an empty stomach with vitamin C' },
    ],
  },
]

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return prescriptions.filter((p) => p.patientId === patientId)
}
