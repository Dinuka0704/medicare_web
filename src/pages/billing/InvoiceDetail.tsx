import { useNavigate, useParams } from 'react-router-dom'
import { Printer, CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Logo } from '@/components/layout/Logo'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { useConfirm } from '@/context/ConfirmContext'
import { getPatientFullName } from '@/data/patients'
import { formatCurrency, formatDate, getAge } from '@/utils/format'
import { computeInvoiceTotals, invoiceGrandTotal, itemTotal } from '@/utils/calculations'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const { invoices, patients, updateInvoice } = useData()

  const invoice = invoices.find((i) => i.id === id)
  const patient = invoice ? patients.find((p) => p.id === invoice.patientId) : undefined

  if (!invoice || !patient) {
    return (
      <EmptyState
        title="Invoice not found"
        description="This invoice doesn't exist or has been removed."
        action={<Button onClick={() => navigate('/billing')}>Back to Billing</Button>}
      />
    )
  }

  const totals = computeInvoiceTotals(invoice.items, invoice.discount, invoice.tax)

  const handleMarkPaid = () => {
    updateInvoice(invoice.id, { status: 'Paid', amountPaid: totals.grandTotal })
    toast.success('Payment recorded', `${invoice.id} has been marked as paid.`)
  }

  const handleCancel = async () => {
    const ok = await confirm({
      title: `Cancel invoice ${invoice.id}?`,
      description: 'This invoice will be marked as cancelled and excluded from revenue calculations.',
      confirmLabel: 'Cancel Invoice',
      danger: true,
    })
    if (ok) {
      updateInvoice(invoice.id, { status: 'Cancelled' })
      toast.success('Invoice cancelled', `${invoice.id} has been cancelled.`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={invoice.id}
        description="Invoice details and payment status"
        breadcrumbs={[{ label: 'Billing', to: '/billing' }, { label: invoice.id }]}
        actions={
          <>
            {invoice.status !== 'Paid' && invoice.status !== 'Cancelled' && (
              <>
                <Button variant="outline" className="text-danger-600 hover:bg-danger-50" icon={<XCircle className="size-4" />} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button icon={<CheckCircle2 className="size-4" />} onClick={handleMarkPaid}>
                  Mark as Paid
                </Button>
              </>
            )}
            <Button variant="outline" icon={<Printer className="size-4" />} onClick={() => window.print()}>
              Print
            </Button>
          </>
        }
      />

      <div className="print-area mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:border-none print:shadow-none">
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <Logo />
          <div className="text-right text-xs text-muted">
            <p className="font-semibold text-ink">Medicare Hospital</p>
            <p>No. 45, Hospital Road, Colombo 05</p>
            <p>+94 11 234 5678 · billing@medicare.lk</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Billed To</p>
            <p className="font-medium text-ink">{getPatientFullName(patient)}</p>
            <p className="text-xs text-muted">
              {patient.id} · {getAge(patient.dob)} yrs · {patient.phone}
            </p>
            <p className="text-xs text-muted">{patient.address}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Invoice</p>
            <p className="font-medium text-ink">{invoice.id}</p>
            <p className="text-xs text-muted">Date: {formatDate(invoice.date)}</p>
            <p className="text-xs text-muted">Due: {formatDate(invoice.dueDate)}</p>
            <div className="mt-1">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-4 py-2.5">Description</th>
                <th className="px-4 py-2.5 text-right">Qty</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2.5 text-ink">{item.description}</td>
                  <td className="px-4 py-2.5 text-right text-muted">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right text-muted">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-ink">{formatCurrency(itemTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs flex-col gap-2 text-sm">
            <div className="flex justify-between py-1 text-muted">
              <span>Subtotal</span>
              <span className="text-ink">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-muted">
              <span>Discount ({invoice.discount}%)</span>
              <span className="text-danger-600">-{formatCurrency(totals.discountAmount)}</span>
            </div>
            <div className="flex justify-between py-1 text-muted">
              <span>Tax ({invoice.tax}%)</span>
              <span className="text-ink">+{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 py-2 text-base font-bold text-ink">
              <span>Grand Total</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-muted">
              <span>Amount Paid</span>
              <span className="text-success-600">{formatCurrency(invoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between py-1 font-semibold text-ink">
              <span>Balance Due</span>
              <span>{formatCurrency(Math.max(invoiceGrandTotal(invoice) - invoice.amountPaid, 0))}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-muted">
          <p>Payment Method: {invoice.method}</p>
          <p className="mt-1">Thank you for choosing Medicare Hospital. For billing queries, contact billing@medicare.lk.</p>
        </div>
      </div>
    </div>
  )
}
