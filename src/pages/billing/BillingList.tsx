import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Wallet, Clock, CheckCircle2, AlertCircle, Eye, Receipt } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Table } from '@/components/ui/Table'
import type { Column } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { useData } from '@/context/DataContext'
import { getPatientFullName } from '@/data/patients'
import { TODAY } from '@/data/appointments'
import { formatCurrency, formatDate } from '@/utils/format'
import { invoiceGrandTotal } from '@/utils/calculations'
import type { Invoice } from '@/types'

const statusOptions = ['Paid', 'Pending', 'Partial', 'Cancelled']

export default function BillingList() {
  const { invoices, patients } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const todaysRevenue = invoices
    .filter((i) => i.date === TODAY && i.status !== 'Cancelled')
    .reduce((sum, i) => sum + invoiceGrandTotal(i), 0)
  const pendingPayments = invoices.filter((i) => i.status === 'Pending' || i.status === 'Partial').length
  const paidInvoices = invoices.filter((i) => i.status === 'Paid').length
  const outstandingAmount = invoices
    .filter((i) => i.status !== 'Cancelled')
    .reduce((sum, i) => sum + Math.max(invoiceGrandTotal(i) - i.amountPaid, 0), 0)

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const patient = patients.find((p) => p.id === inv.patientId)
      const matchesSearch =
        !search ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        (patient && getPatientFullName(patient).toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = !status || inv.status === status
      return matchesSearch && matchesStatus
    })
  }, [invoices, patients, search, status])

  const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1))

  const columns: Column<Invoice>[] = [
    { key: 'id', header: 'Invoice ID', render: (i) => <span className="font-medium text-primary-600">{i.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      render: (i) => {
        const patient = patients.find((p) => p.id === i.patientId)
        return patient ? getPatientFullName(patient) : '—'
      },
    },
    { key: 'appointment', header: 'Appointment', render: (i) => i.appointmentId ?? '—' },
    { key: 'date', header: 'Date', render: (i) => formatDate(i.date) },
    { key: 'amount', header: 'Amount', render: (i) => <span className="font-medium">{formatCurrency(invoiceGrandTotal(i))}</span> },
    { key: 'status', header: 'Payment Status', render: (i) => <StatusBadge status={i.status} /> },
    { key: 'method', header: 'Payment Method', render: (i) => i.method },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (i) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Link to={`/billing/${i.id}`} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-primary-600" aria-label="View invoice">
            <Eye className="size-4" />
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing"
        description="Track invoices, payments and hospital revenue."
        actions={
          <Link to="/billing/new">
            <Button icon={<Plus className="size-4" />}>Create Invoice</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Revenue" value={formatCurrency(todaysRevenue)} icon={<Wallet className="size-5" />} tone="success" />
        <StatCard label="Pending Payments" value={pendingPayments} icon={<Clock className="size-5" />} tone="warning" />
        <StatCard label="Paid Invoices" value={paidInvoices} icon={<CheckCircle2 className="size-5" />} tone="primary" />
        <StatCard label="Outstanding Amount" value={formatCurrency(outstandingAmount)} icon={<AlertCircle className="size-5" />} tone="danger" />
      </div>

      <Card padding="sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by invoice ID or patient..." containerClassName="sm:max-w-xs" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions.map((s) => ({ value: s, label: s }))} placeholder="Payment Status" className="sm:max-w-[200px]" />
        </div>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState icon={<Receipt className="size-6" />} title="No invoices found" description="Try adjusting your search or filters." />
        </Card>
      ) : (
        <Table columns={columns} data={sorted} keyField="id" onRowClick={(i) => navigate(`/billing/${i.id}`)} />
      )}
    </div>
  )
}
