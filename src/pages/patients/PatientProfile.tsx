import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Pencil,
  CalendarPlus,
  Phone,
  Mail,
  Droplet,
  AlertTriangle,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  FileStack,
  Trash2,
  Download,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { useConfirm } from '@/context/ConfirmContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { formatCurrency, formatDate, getAge } from '@/utils/format'
import { invoiceGrandTotal, invoiceBalance } from '@/utils/calculations'

const tabs: TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'history', label: 'Medical History' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'prescriptions', label: 'Prescriptions' },
  { value: 'labs', label: 'Lab Reports' },
  { value: 'billing', label: 'Billing' },
  { value: 'documents', label: 'Documents' },
]

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const toast = useToast()
  const { patients, appointments, medicalRecords, prescriptions, invoices, doctors, removePatient } = useData()
  const [activeTab, setActiveTab] = useState('overview')

  const patient = patients.find((p) => p.id === id)

  const patientAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === id).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [appointments, id],
  )
  const patientRecords = useMemo(() => medicalRecords.filter((r) => r.patientId === id), [medicalRecords, id])
  const patientPrescriptions = useMemo(() => prescriptions.filter((p) => p.patientId === id), [prescriptions, id])
  const patientInvoices = useMemo(() => invoices.filter((i) => i.patientId === id), [invoices, id])
  const labReports = patientRecords.filter((r) => r.type === 'Lab Report')
  const historyRecords = patientRecords.filter((r) => r.type !== 'Lab Report')
  const documents = patientRecords.flatMap((r) => r.attachments.map((a) => ({ file: a, record: r })))

  if (!patient) {
    return (
      <EmptyState
        title="Patient not found"
        description="This patient record doesn't exist or has been removed."
        action={<Button onClick={() => navigate('/patients')}>Back to Patients</Button>}
      />
    )
  }

  const handleDelete = async () => {
    const ok = await confirm({
      title: `Delete ${getPatientFullName(patient)}?`,
      description: 'This will permanently remove the patient and all associated records. This action cannot be undone.',
      confirmLabel: 'Delete Patient',
      danger: true,
    })
    if (ok) {
      removePatient(patient.id)
      toast.success('Patient deleted', `${getPatientFullName(patient)} has been removed.`)
      navigate('/patients')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patient Profile"
        breadcrumbs={[{ label: 'Patients', to: '/patients' }, { label: getPatientFullName(patient) }]}
        actions={
          <>
            <Link to={`/appointments/new?patientId=${patient.id}`}>
              <Button variant="outline" icon={<CalendarPlus className="size-4" />}>
                Book Appointment
              </Button>
            </Link>
            <Link to={`/patients/${patient.id}/edit`}>
              <Button icon={<Pencil className="size-4" />}>Edit</Button>
            </Link>
          </>
        }
      />

      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="xl" />
            <div>
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <h2 className="text-xl font-bold text-ink">{getPatientFullName(patient)}</h2>
                <StatusBadge status={patient.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted">
                {patient.id} · {getAge(patient.dob)} yrs · {patient.gender}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {patient.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {patient.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplet className="size-3.5" /> {patient.bloodGroup}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="text-danger-600 hover:bg-danger-50" onClick={handleDelete} icon={<Trash2 className="size-4" />}>
            Delete
          </Button>
        </div>
      </Card>

      <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Card>
              <CardHeader title="Personal Information" />
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date of Birth" value={formatDate(patient.dob)} />
                <Field label="Gender" value={patient.gender} />
                <Field label="NIC / ID" value={patient.nic} />
                <Field label="Blood Group" value={patient.bloodGroup} />
                <Field label="Address" value={patient.address} className="sm:col-span-2" />
                <Field label="Registered On" value={formatDate(patient.registeredDate)} />
                <Field label="Last Visit" value={formatDate(patient.lastVisit)} />
              </dl>
            </Card>

            <Card>
              <CardHeader title="Emergency Contact" />
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Name" value={patient.emergencyContact.name} />
                <Field label="Relationship" value={patient.emergencyContact.relationship} />
                <Field label="Phone" value={patient.emergencyContact.phone} />
              </dl>
            </Card>

            <Card>
              <CardHeader title="Recent Visits" />
              {patientAppointments.length === 0 ? (
                <p className="text-sm text-muted">No visits recorded yet.</p>
              ) : (
                <div className="flex flex-col divide-y divide-slate-100">
                  {patientAppointments.slice(0, 4).map((apt) => {
                    const doctor = doctors.find((d) => d.id === apt.doctorId)
                    return (
                      <div key={apt.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-ink">{doctor?.name}</p>
                          <p className="text-xs text-muted">
                            {formatDate(apt.date)} · {apt.time} · {apt.reason}
                          </p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title="Allergies" />
              {patient.allergies.length === 0 ? (
                <p className="text-sm text-muted">No known allergies.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((a) => (
                    <Badge key={a} variant="danger">
                      <AlertTriangle className="size-3" /> {a}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Medical Summary" />
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Existing Conditions</p>
              {patient.conditions.length === 0 ? (
                <p className="mb-4 text-sm text-muted">None reported.</p>
              ) : (
                <div className="mb-4 flex flex-wrap gap-2">
                  {patient.conditions.map((c) => (
                    <Badge key={c} variant="warning">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Current Medication" />
              {patient.medications.length === 0 ? (
                <p className="text-sm text-muted">No active medication.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {patient.medications.map((m) => (
                    <div key={m} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-ink">
                      <Pill className="size-3.5 text-primary-600" /> {m}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader title="Medical History" description="Consultations, diagnoses and discharge summaries" />
          {historyRecords.length === 0 ? (
            <EmptyState icon={<FileText className="size-6" />} title="No medical history" description="No records have been added for this patient yet." />
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {historyRecords.map((r) => (
                <div key={r.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{r.title}</p>
                    <Badge variant="info">{r.type}</Badge>
                  </div>
                  <p className="text-xs text-muted">{formatDate(r.date)}</p>
                  <p className="mt-1 text-sm text-muted">{r.summary}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'appointments' && (
        <Card padding="none">
          {patientAppointments.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={<CalendarPlus className="size-6" />} title="No appointments" description="This patient has no appointment history." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3">Doctor</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Reason</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientAppointments.map((apt) => {
                    const doctor = doctors.find((d) => d.id === apt.doctorId)
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-ink">{doctor?.name}</td>
                        <td className="px-5 py-3 text-muted">{formatDate(apt.date)}</td>
                        <td className="px-5 py-3 text-muted">{apt.time}</td>
                        <td className="px-5 py-3 text-muted">{apt.reason}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={apt.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'prescriptions' && (
        <div className="flex flex-col gap-4">
          {patientPrescriptions.length === 0 ? (
            <Card>
              <EmptyState icon={<Pill className="size-6" />} title="No prescriptions" description="No prescriptions have been issued for this patient." />
            </Card>
          ) : (
            patientPrescriptions.map((rx) => {
              const doctor = doctors.find((d) => d.id === rx.doctorId)
              return (
                <Card key={rx.id}>
                  <CardHeader
                    title={rx.diagnosis}
                    description={`${doctor?.name} · ${formatDate(rx.date)}`}
                    action={<Badge variant="primary">{rx.id}</Badge>}
                  />
                  <div className="flex flex-col divide-y divide-slate-100">
                    {rx.medications.map((m) => (
                      <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm first:pt-0 last:pb-0">
                        <span className="font-medium text-ink">
                          {m.name} <span className="text-muted font-normal">{m.dosage}</span>
                        </span>
                        <span className="text-muted">
                          {m.frequency} · {m.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'labs' && (
        <Card>
          <CardHeader title="Lab Reports" />
          {labReports.length === 0 ? (
            <EmptyState icon={<FlaskConical className="size-6" />} title="No lab reports" description="No laboratory reports available for this patient." />
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {labReports.map((r) => (
                <div key={r.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-ink">{r.title}</p>
                  <p className="text-xs text-muted">{formatDate(r.date)}</p>
                  <p className="mt-1 text-sm text-muted">{r.summary}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card padding="none">
          {patientInvoices.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={<Receipt className="size-6" />} title="No billing history" description="No invoices found for this patient." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Balance</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientInvoices.map((inv) => (
                    <tr key={inv.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/billing/${inv.id}`)}>
                      <td className="px-5 py-3 font-medium text-primary-600">{inv.id}</td>
                      <td className="px-5 py-3 text-muted">{formatDate(inv.date)}</td>
                      <td className="px-5 py-3 text-ink">{formatCurrency(invoiceGrandTotal(inv))}</td>
                      <td className="px-5 py-3 text-ink">{formatCurrency(invoiceBalance(inv))}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <CardHeader title="Documents" description="Attachments from consultations, labs and scans" />
          {documents.length === 0 ? (
            <EmptyState icon={<FileStack className="size-6" />} title="No documents" description="No documents have been uploaded for this patient." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{doc.file}</p>
                      <p className="text-xs text-muted">{doc.record.title}</p>
                    </div>
                  </div>
                  <button type="button" className="shrink-0 text-muted hover:text-primary-600" aria-label="Download document">
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  )
}

