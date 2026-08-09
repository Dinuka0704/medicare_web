import type { Appointment } from '@/types'

export const TODAY = '2026-08-09'

export const appointments: Appointment[] = [
  { id: 'APT-2001', patientId: 'PT-1001', doctorId: 'DOC-001', department: 'Cardiology', date: TODAY, time: '09:00 AM', room: 'Room 101', status: 'Confirmed', visitType: 'Follow-up', reason: 'Blood pressure review' },
  { id: 'APT-2002', patientId: 'PT-1002', doctorId: 'DOC-003', department: 'General Medicine', date: TODAY, time: '09:30 AM', room: 'Room 204', status: 'Waiting', visitType: 'New Visit', reason: 'General checkup' },
  { id: 'APT-2003', patientId: 'PT-1003', doctorId: 'DOC-001', department: 'Cardiology', date: TODAY, time: '10:00 AM', room: 'Room 101', status: 'Scheduled', visitType: 'Consultation', reason: 'Chest pain evaluation' },
  { id: 'APT-2004', patientId: 'PT-1004', doctorId: 'DOC-006', department: 'Pediatrics', date: TODAY, time: '10:30 AM', room: 'Room 305', status: 'Confirmed', visitType: 'Follow-up', reason: 'Asthma review' },
  { id: 'APT-2005', patientId: 'PT-1005', doctorId: 'DOC-001', department: 'Cardiology', date: TODAY, time: '11:00 AM', room: 'Room 101', status: 'Waiting', visitType: 'Follow-up', reason: 'Post-angioplasty review' },
  { id: 'APT-2006', patientId: 'PT-1006', doctorId: 'DOC-002', department: 'Dermatology', date: TODAY, time: '11:30 AM', room: 'Room 210', status: 'Scheduled', visitType: 'New Visit', reason: 'Skin allergy' },
  { id: 'APT-2007', patientId: 'PT-1007', doctorId: 'DOC-003', department: 'General Medicine', date: TODAY, time: '01:00 PM', room: 'Room 204', status: 'Cancelled', visitType: 'Consultation', reason: 'Fatigue and fever' },
  { id: 'APT-2008', patientId: 'PT-1008', doctorId: 'DOC-006', department: 'Pediatrics', date: TODAY, time: '01:30 PM', room: 'Room 305', status: 'Completed', visitType: 'New Visit', reason: 'Vaccination' },
  { id: 'APT-2009', patientId: 'PT-1009', doctorId: 'DOC-004', department: 'Neurology', date: TODAY, time: '02:00 PM', room: 'Room 402', status: 'Scheduled', visitType: 'Consultation', reason: 'Recurring migraines' },
  { id: 'APT-2010', patientId: 'PT-1010', doctorId: 'DOC-007', department: 'Gynecology', date: TODAY, time: '02:30 PM', room: 'Room 501', status: 'Confirmed', visitType: 'New Visit', reason: 'Routine checkup' },
  { id: 'APT-2011', patientId: 'PT-1011', doctorId: 'DOC-005', department: 'Orthopedics', date: TODAY, time: '03:00 PM', room: 'Room 308', status: 'Waiting', visitType: 'Follow-up', reason: 'Knee pain review' },
  { id: 'APT-2012', patientId: 'PT-1012', doctorId: 'DOC-003', department: 'General Medicine', date: TODAY, time: '03:30 PM', room: 'Room 204', status: 'Scheduled', visitType: 'Follow-up', reason: 'Thyroid levels review' },

  { id: 'APT-2013', patientId: 'PT-1013', doctorId: 'DOC-008', department: 'ENT', date: '2026-08-10', time: '09:00 AM', room: 'Room 112', status: 'Scheduled', visitType: 'New Visit', reason: 'Ear infection' },
  { id: 'APT-2014', patientId: 'PT-1014', doctorId: 'DOC-003', department: 'General Medicine', date: '2026-08-10', time: '10:00 AM', room: 'Room 204', status: 'Confirmed', visitType: 'Follow-up', reason: 'Anemia review' },
  { id: 'APT-2015', patientId: 'PT-1015', doctorId: 'DOC-001', department: 'Cardiology', date: '2026-08-10', time: '11:00 AM', room: 'Room 101', status: 'Confirmed', visitType: 'Follow-up', reason: 'Diabetes and hypertension review' },
  { id: 'APT-2016', patientId: 'PT-1016', doctorId: 'DOC-006', department: 'Pediatrics', date: '2026-08-11', time: '09:30 AM', room: 'Room 305', status: 'Scheduled', visitType: 'New Visit', reason: 'Growth checkup' },
  { id: 'APT-2017', patientId: 'PT-1017', doctorId: 'DOC-002', department: 'Dermatology', date: '2026-08-11', time: '10:30 AM', room: 'Room 210', status: 'Scheduled', visitType: 'Consultation', reason: 'Acne treatment' },
  { id: 'APT-2018', patientId: 'PT-1018', doctorId: 'DOC-004', department: 'Neurology', date: '2026-08-12', time: '02:00 PM', room: 'Room 402', status: 'Scheduled', visitType: 'Follow-up', reason: 'Arthritis-related nerve pain' },
  { id: 'APT-2019', patientId: 'PT-1019', doctorId: 'DOC-005', department: 'Orthopedics', date: '2026-08-12', time: '03:00 PM', room: 'Room 308', status: 'Scheduled', visitType: 'New Visit', reason: 'Sports injury' },
  { id: 'APT-2020', patientId: 'PT-1020', doctorId: 'DOC-006', department: 'Pediatrics', date: '2026-08-13', time: '09:00 AM', room: 'Room 305', status: 'Scheduled', visitType: 'Follow-up', reason: 'Asthma management' },

  { id: 'APT-2021', patientId: 'PT-1001', doctorId: 'DOC-001', department: 'Cardiology', date: '2026-08-02', time: '09:00 AM', room: 'Room 101', status: 'Completed', visitType: 'Follow-up', reason: 'Blood pressure review' },
  { id: 'APT-2022', patientId: 'PT-1003', doctorId: 'DOC-001', department: 'Cardiology', date: '2026-08-08', time: '10:00 AM', room: 'Room 101', status: 'Completed', visitType: 'Consultation', reason: 'Diabetes follow-up' },
  { id: 'APT-2023', patientId: 'PT-1002', doctorId: 'DOC-003', department: 'General Medicine', date: '2026-08-05', time: '11:00 AM', room: 'Room 204', status: 'Completed', visitType: 'New Visit', reason: 'General checkup' },
  { id: 'APT-2024', patientId: 'PT-1018', doctorId: 'DOC-004', department: 'Neurology', date: '2026-07-30', time: '02:00 PM', room: 'Room 402', status: 'Completed', visitType: 'Consultation', reason: 'Joint pain evaluation' },
  { id: 'APT-2025', patientId: 'PT-1014', doctorId: 'DOC-003', department: 'General Medicine', date: '2026-07-25', time: '09:00 AM', room: 'Room 204', status: 'Cancelled', visitType: 'Follow-up', reason: 'Anemia review' },
]

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((a) => a.id === id)
}

export const timeSlotsByDoctor: Record<string, string[]> = {
  'DOC-001': ['09:00 AM', '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
  'DOC-002': ['09:30 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM'],
  'DOC-003': ['08:30 AM', '09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM'],
  'DOC-004': ['10:00 AM', '11:00 AM', '02:00 PM'],
  'DOC-005': ['08:00 AM', '09:00 AM', '11:00 AM', '02:30 PM'],
  'DOC-006': ['09:00 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM'],
  'DOC-007': ['09:00 AM', '10:30 AM', '02:00 PM', '03:00 PM'],
  'DOC-008': ['09:00 AM', '10:00 AM', '01:00 PM', '04:00 PM'],
}
