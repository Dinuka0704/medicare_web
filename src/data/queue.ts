import type { QueueEntry } from '@/types'

export const queueEntries: QueueEntry[] = [
  { id: 'Q-001', queueNumber: 1, patientId: 'PT-1001', doctorId: 'DOC-001', appointmentTime: '09:00 AM', arrivalTime: '08:45 AM', status: 'In Consultation' },
  { id: 'Q-002', queueNumber: 2, patientId: 'PT-1002', doctorId: 'DOC-003', appointmentTime: '09:30 AM', arrivalTime: '09:10 AM', status: 'Waiting' },
  { id: 'Q-003', queueNumber: 3, patientId: 'PT-1003', doctorId: 'DOC-001', appointmentTime: '10:00 AM', arrivalTime: '09:20 AM', status: 'Waiting' },
  { id: 'Q-004', queueNumber: 4, patientId: 'PT-1004', doctorId: 'DOC-006', appointmentTime: '10:30 AM', arrivalTime: '09:50 AM', status: 'Called' },
  { id: 'Q-005', queueNumber: 5, patientId: 'PT-1005', doctorId: 'DOC-001', appointmentTime: '11:00 AM', arrivalTime: '10:15 AM', status: 'Waiting' },
  { id: 'Q-006', queueNumber: 6, patientId: 'PT-1006', doctorId: 'DOC-002', appointmentTime: '11:30 AM', arrivalTime: '10:40 AM', status: 'Waiting' },
  { id: 'Q-007', queueNumber: 7, patientId: 'PT-1008', doctorId: 'DOC-006', appointmentTime: '01:30 PM', arrivalTime: '01:05 PM', status: 'Completed' },
]
