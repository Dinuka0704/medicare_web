import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Patient,
  Doctor,
  Appointment,
  Invoice,
  QueueEntry,
  AppNotification,
  MedicalRecord,
  Prescription,
} from '@/types'
import { patients as seedPatients } from '@/data/patients'
import { doctors as seedDoctors } from '@/data/doctors'
import { appointments as seedAppointments } from '@/data/appointments'
import { invoices as seedInvoices } from '@/data/invoices'
import { queueEntries as seedQueue } from '@/data/queue'
import { notifications as seedNotifications } from '@/data/notifications'
import { medicalRecords as seedRecords } from '@/data/medicalRecords'
import { prescriptions as seedPrescriptions } from '@/data/prescriptions'

interface DataContextValue {
  patients: Patient[]
  addPatient: (p: Patient) => void
  updatePatient: (id: string, patch: Partial<Patient>) => void
  removePatient: (id: string) => void

  doctors: Doctor[]
  updateDoctor: (id: string, patch: Partial<Doctor>) => void

  appointments: Appointment[]
  addAppointment: (a: Appointment) => void
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  removeAppointment: (id: string) => void

  invoices: Invoice[]
  addInvoice: (inv: Invoice) => void
  updateInvoice: (id: string, patch: Partial<Invoice>) => void

  queueEntries: QueueEntry[]
  addQueueEntry: (q: QueueEntry) => void
  updateQueueEntry: (id: string, patch: Partial<QueueEntry>) => void

  notifications: AppNotification[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  medicalRecords: MedicalRecord[]
  addMedicalRecord: (r: MedicalRecord) => void

  prescriptions: Prescription[]
  addPrescription: (p: Prescription) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(seedPatients)
  const [doctors, setDoctors] = useState<Doctor[]>(seedDoctors)
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices)
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>(seedQueue)
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(seedRecords)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(seedPrescriptions)

  const value: DataContextValue = {
    patients,
    addPatient: (p) => setPatients((prev) => [p, ...prev]),
    updatePatient: (id, patch) =>
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    removePatient: (id) => setPatients((prev) => prev.filter((p) => p.id !== id)),

    doctors,
    updateDoctor: (id, patch) =>
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),

    appointments,
    addAppointment: (a) => setAppointments((prev) => [a, ...prev]),
    updateAppointment: (id, patch) =>
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    removeAppointment: (id) => setAppointments((prev) => prev.filter((a) => a.id !== id)),

    invoices,
    addInvoice: (inv) => setInvoices((prev) => [inv, ...prev]),
    updateInvoice: (id, patch) =>
      setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i))),

    queueEntries,
    addQueueEntry: (q) => setQueueEntries((prev) => [...prev, q]),
    updateQueueEntry: (id, patch) =>
      setQueueEntries((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q))),

    notifications,
    markNotificationRead: (id) =>
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllNotificationsRead: () =>
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),

    medicalRecords,
    addMedicalRecord: (r) => setMedicalRecords((prev) => [r, ...prev]),

    prescriptions,
    addPrescription: (p) => setPrescriptions((prev) => [p, ...prev]),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
