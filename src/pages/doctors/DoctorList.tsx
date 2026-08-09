import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Phone, Mail, CalendarCheck, Stethoscope, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { departmentNames } from '@/data/departments'

const statusMap = { Available: 'online', Busy: 'busy', 'On Leave': 'away' } as const

export default function DoctorList() {
  const { doctors } = useData()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
      const matchesDept = !department || d.department === department
      const matchesStatus = !status || d.status === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [doctors, search, department, status])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Doctors"
        description="Browse hospital medical staff and their availability."
        actions={
          user?.role === 'admin' ? (
            <Button icon={<Plus className="size-4" />}>Add Doctor</Button>
          ) : undefined
        }
      />

      <Card padding="sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or specialization..." containerClassName="sm:max-w-xs" />
          <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-md">
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={departmentNames.map((d) => ({ value: d, label: d }))}
              placeholder="Department"
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={['Available', 'Busy', 'On Leave'].map((s) => ({ value: s, label: s }))}
              placeholder="Status"
            />
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Stethoscope className="size-6" />} title="No doctors found" description="Try adjusting your search or filters." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <Link key={doc.id} to={`/doctors/${doc.id}`}>
              <Card className="flex h-full flex-col gap-4 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={doc.avatar} name={doc.name} size="lg" status={statusMap[doc.status]} />
                    <div>
                      <p className="font-semibold text-ink">{doc.name}</p>
                      <p className="text-sm text-muted">{doc.specialization}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={doc.status} />
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Star className="size-3.5 fill-warning-500 text-warning-500" /> {doc.rating}
                  </span>
                  <span className="text-xs text-muted">· {doc.department}</span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5" /> {doc.phone}
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="size-3.5 shrink-0" /> {doc.email}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="flex items-center gap-1.5 text-muted">
                    <CalendarCheck className="size-3.5" /> Today
                  </span>
                  <span className="font-semibold text-ink">{doc.todayAppointments} appointments</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
