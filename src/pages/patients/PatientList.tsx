import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, Plus, Users } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Table } from '@/components/ui/Table'
import type { Column } from '@/components/ui/Table'
import { Avatar } from '@/components/ui/Avatar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { useConfirm } from '@/context/ConfirmContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import type { Patient } from '@/types'
import { formatDate, getAge } from '@/utils/format'

const PAGE_SIZE = 8

const ageRanges = [
  { value: '', label: 'All Ages' },
  { value: '0-18', label: '0 - 18 years' },
  { value: '19-35', label: '19 - 35 years' },
  { value: '36-60', label: '36 - 60 years' },
  { value: '61-120', label: '60+ years' },
]

export default function PatientList() {
  const { patients, removePatient } = useData()
  const confirm = useConfirm()
  const toast = useToast()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [status, setStatus] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const fullName = getPatientFullName(p).toLowerCase()
      const matchesSearch =
        !search ||
        fullName.includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
      const matchesGender = !gender || p.gender === gender
      const matchesBlood = !bloodGroup || p.bloodGroup === bloodGroup
      const matchesStatus = !status || p.status === status
      let matchesAge = true
      if (ageRange) {
        const [min, max] = ageRange.split('-').map(Number)
        const age = getAge(p.dob)
        matchesAge = age >= min && age <= max
      }
      return matchesSearch && matchesGender && matchesBlood && matchesStatus && matchesAge
    })
  }, [patients, search, gender, bloodGroup, status, ageRange])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = async (patient: Patient) => {
    const ok = await confirm({
      title: `Delete ${getPatientFullName(patient)}?`,
      description: 'This will permanently remove the patient record, including their medical history. This action cannot be undone.',
      confirmLabel: 'Delete Patient',
      danger: true,
    })
    if (ok) {
      removePatient(patient.id)
      toast.success('Patient deleted', `${getPatientFullName(patient)} has been removed.`)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setGender('')
    setBloodGroup('')
    setStatus('')
    setAgeRange('')
    setPage(1)
  }

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      header: 'Patient',
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar src={p.avatar} name={getPatientFullName(p)} size="sm" />
          <div>
            <p className="font-medium text-ink">{getPatientFullName(p)}</p>
            <p className="text-xs text-muted">{p.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'age', header: 'Age', render: (p) => `${getAge(p.dob)} yrs` },
    { key: 'gender', header: 'Gender', render: (p) => p.gender },
    { key: 'phone', header: 'Phone', render: (p) => p.phone },
    { key: 'bloodGroup', header: 'Blood Group', render: (p) => <span className="font-medium">{p.bloodGroup}</span> },
    { key: 'lastVisit', header: 'Last Visit', render: (p) => formatDate(p.lastVisit) },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/patients/${p.id}`}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-primary-600"
            aria-label="View patient"
          >
            <Eye className="size-4" />
          </Link>
          <Link
            to={`/patients/${p.id}/edit`}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-primary-600"
            aria-label="Edit patient"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(p)}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-danger-50 hover:text-danger-600"
            aria-label="Delete patient"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patients"
        description="Manage hospital patient records."
        actions={
          <Link to="/patients/new">
            <Button icon={<Plus className="size-4" />}>Add Patient</Button>
          </Link>
        }
      />

      <Card padding="sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search by name, ID or phone..."
            containerClassName="lg:max-w-xs"
          />
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            <Select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value)
                setPage(1)
              }}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              placeholder="Gender"
            />
            <Select
              value={ageRange}
              onChange={(e) => {
                setAgeRange(e.target.value)
                setPage(1)
              }}
              options={ageRanges.filter((r) => r.value).map((r) => ({ value: r.value, label: r.label }))}
              placeholder="Age"
            />
            <Select
              value={bloodGroup}
              onChange={(e) => {
                setBloodGroup(e.target.value)
                setPage(1)
              }}
              options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((v) => ({ value: v, label: v }))}
              placeholder="Blood Group"
            />
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              options={['Active', 'Inactive', 'Critical'].map((v) => ({ value: v, label: v }))}
              placeholder="Status"
            />
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="size-6" />}
            title="No patients found"
            description="Try adjusting your search or filters, or add a new patient to get started."
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
                <Link to="/patients/new">
                  <Button icon={<Plus className="size-4" />}>Add Patient</Button>
                </Link>
              </div>
            }
          />
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Table columns={columns} data={paginated} keyField="id" onRowClick={(p) => navigate(`/patients/${p.id}`)} />
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {paginated.map((p) => (
              <Card key={p.id} padding="sm" className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Link to={`/patients/${p.id}`} className="flex items-center gap-3">
                    <Avatar src={p.avatar} name={getPatientFullName(p)} size="md" />
                    <div>
                      <p className="font-medium text-ink">{getPatientFullName(p)}</p>
                      <p className="text-xs text-muted">{p.id}</p>
                    </div>
                  </Link>
                  <StatusBadge status={p.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                  <p>
                    Age: <span className="text-ink font-medium">{getAge(p.dob)}</span>
                  </p>
                  <p>
                    Gender: <span className="text-ink font-medium">{p.gender}</span>
                  </p>
                  <p>
                    Blood: <span className="text-ink font-medium">{p.bloodGroup}</span>
                  </p>
                  <p>
                    Last Visit: <span className="text-ink font-medium">{formatDate(p.lastVisit)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  <Link to={`/patients/${p.id}`} className="flex-1">
                    <Button variant="outline" size="sm" fullWidth icon={<Eye className="size-3.5" />}>
                      View
                    </Button>
                  </Link>
                  <Link to={`/patients/${p.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" fullWidth icon={<Pencil className="size-3.5" />}>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-danger-600"
                    onClick={() => handleDelete(p)}
                    aria-label="Delete patient"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
