export type Role = 'admin' | 'doctor' | 'receptionist'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  phone?: string
  department?: string
  designation?: string
}

export type Gender = 'Male' | 'Female' | 'Other'

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type PatientStatus = 'Active' | 'Inactive' | 'Critical'

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Vitals {
  date: string
  bp: string
  pulse: string
  temp: string
  weight: string
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dob: string
  gender: Gender
  nic: string
  bloodGroup: BloodGroup
  phone: string
  email: string
  address: string
  emergencyContact: EmergencyContact
  allergies: string[]
  conditions: string[]
  medications: string[]
  avatar?: string
  status: PatientStatus
  lastVisit: string
  registeredDate: string
  vitals?: Vitals[]
}

export type DoctorStatus = 'Available' | 'Busy' | 'On Leave'

export interface DoctorScheduleSlot {
  day: string
  start: string
  end: string
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  department: string
  phone: string
  email: string
  avatar?: string
  status: DoctorStatus
  experienceYears: number
  rating: number
  consultationFee: number
  todayAppointments: number
  totalPatients: number
  bio: string
  qualifications: string[]
  schedule: DoctorScheduleSlot[]
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Waiting'
  | 'Completed'
  | 'Cancelled'

export type VisitType = 'New Visit' | 'Follow-up' | 'Consultation' | 'Emergency'

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  department: string
  date: string
  time: string
  room: string
  status: AppointmentStatus
  visitType: VisitType
  reason: string
  notes?: string
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Cancelled'

export type PaymentMethod = 'Cash' | 'Card' | 'Insurance' | 'Bank Transfer'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  patientId: string
  appointmentId?: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  discount: number
  tax: number
  status: PaymentStatus
  method: PaymentMethod
  amountPaid: number
}

export type RecordType =
  | 'Consultation'
  | 'Prescription'
  | 'Lab Report'
  | 'Scan'
  | 'Diagnosis'
  | 'Discharge Summary'

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  type: RecordType
  title: string
  date: string
  summary: string
  attachments: string[]
}

export interface PrescriptionMedication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  diagnosis: string
  medications: PrescriptionMedication[]
  date: string
  notes?: string
}

export type NotificationType = 'appointment' | 'payment' | 'patient' | 'report' | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

export type QueueStatus = 'Waiting' | 'Called' | 'In Consultation' | 'Completed'

export interface QueueEntry {
  id: string
  queueNumber: number
  patientId: string
  doctorId: string
  appointmentTime: string
  arrivalTime: string
  status: QueueStatus
}

export interface Department {
  id: string
  name: string
  description: string
  headDoctorId?: string
  patientCount: number
}

export interface ActivityLogEntry {
  id: string
  actor: string
  action: string
  time: string
}
