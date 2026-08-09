import { useMemo, useState } from 'react'
import {
  FileText,
  Pill,
  FlaskConical,
  ScanLine,
  Stethoscope,
  ClipboardCheck,
  Download,
  Search as SearchIcon,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { DateInput } from '@/components/ui/DateInput'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useData } from '@/context/DataContext'
import { getPatientFullName } from '@/data/patients'
import { formatDate } from '@/utils/format'
import type { MedicalRecord, RecordType } from '@/types'

const recordTypeIcons: Record<RecordType, typeof FileText> = {
  Consultation: Stethoscope,
  Prescription: Pill,
  'Lab Report': FlaskConical,
  Scan: ScanLine,
  Diagnosis: ClipboardCheck,
  'Discharge Summary': FileText,
}

const recordTypes: RecordType[] = ['Consultation', 'Prescription', 'Lab Report', 'Scan', 'Diagnosis', 'Discharge Summary']

export default function MedicalRecords() {
  const { medicalRecords, patients, doctors } = useData()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [selected, setSelected] = useState<MedicalRecord | null>(null)

  const filtered = useMemo(() => {
    return medicalRecords.filter((r) => {
      const patient = patients.find((p) => p.id === r.patientId)
      const matchesSearch =
        !search ||
        (patient && getPatientFullName(patient).toLowerCase().includes(search.toLowerCase())) ||
        r.patientId.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = !type || r.type === type
      const matchesDate = !date || r.date === date
      return matchesSearch && matchesType && matchesDate
    })
  }, [medicalRecords, patients, search, type, date])

  const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Medical Records" description="Search and review patient medical history across the hospital." />

      <Card padding="sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by patient ID, name or record title..." containerClassName="lg:max-w-sm" />
          <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-md">
            <Select value={type} onChange={(e) => setType(e.target.value)} options={recordTypes.map((t) => ({ value: t, label: t }))} placeholder="Record Type" />
            <DateInput value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState icon={<SearchIcon className="size-6" />} title="No records found" description="Try adjusting your search or filters." />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((record) => {
            const patient = patients.find((p) => p.id === record.patientId)
            const doctor = doctors.find((d) => d.id === record.doctorId)
            const Icon = recordTypeIcons[record.type]
            return (
              <Card
                key={record.id}
                padding="sm"
                className="flex cursor-pointer flex-col gap-3 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                onClick={() => setSelected(record)}
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{record.title}</p>
                      <Badge variant="info">{record.type}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted line-clamp-1">{record.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-13 sm:pl-0">
                  {patient && (
                    <div className="flex items-center gap-2">
                      <Avatar src={patient.avatar} name={getPatientFullName(patient)} size="xs" />
                      <span className="text-sm text-ink whitespace-nowrap">{getPatientFullName(patient)}</span>
                    </div>
                  )}
                  <span className="hidden text-sm text-muted sm:block whitespace-nowrap">{doctor?.name}</span>
                  <span className="text-sm text-muted whitespace-nowrap">{formatDate(record.date)}</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected ? `${selected.type} · ${formatDate(selected.date)}` : ''}
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setSelected(null)}>
            Close
          </Button>
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetaField label="Patient" value={patients.find((p) => p.id === selected.patientId) ? getPatientFullName(patients.find((p) => p.id === selected.patientId)!) : '—'} />
              <MetaField label="Doctor" value={doctors.find((d) => d.id === selected.doctorId)?.name ?? '—'} />
              <MetaField label="Type" value={selected.type} />
              <MetaField label="Date" value={formatDate(selected.date)} />
            </div>
            <div>
              <CardHeader title="Summary" className="mb-2" />
              <p className="text-sm leading-relaxed text-ink">{selected.summary}</p>
            </div>
            {selected.attachments.length > 0 && (
              <div>
                <CardHeader title="Attachments" className="mb-2" />
                <div className="flex flex-col gap-2">
                  {selected.attachments.map((file) => (
                    <div key={file} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm text-ink">
                        <FileText className="size-4 text-primary-600" /> {file}
                      </span>
                      <button type="button" className="text-muted hover:text-primary-600" aria-label="Download attachment">
                        <Download className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}
