import { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Receipt } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { getPatientFullName } from '@/data/patients'
import { formatCurrency, formatDate } from '@/utils/format'
import { generateId } from '@/utils/id'
import { computeInvoiceTotals } from '@/utils/calculations'
import type { Invoice, PaymentMethod } from '@/types'

interface InvoiceFormValues {
  patientId: string
  appointmentId: string
  method: PaymentMethod
  discount: number
  tax: number
  items: { description: string; quantity: number; unitPrice: number }[]
}

const presetItems = [
  { label: 'Consultation Fee', price: 2500 },
  { label: 'Laboratory Test', price: 3000 },
  { label: 'Medication', price: 500 },
  { label: 'Room Charges', price: 5000 },
  { label: 'Other Service', price: 1000 },
]

const paymentMethods: PaymentMethod[] = ['Cash', 'Card', 'Insurance', 'Bank Transfer']

export default function NewInvoice() {
  const { patients, appointments, addInvoice } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      patientId: '',
      appointmentId: '',
      method: 'Cash',
      discount: 0,
      tax: 8,
      items: [{ description: 'Consultation Fee', quantity: 1, unitPrice: 2500 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const patientId = watch('patientId')
  const items = watch('items')
  const discount = watch('discount') || 0
  const tax = watch('tax') || 0

  const patientAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === patientId),
    [appointments, patientId],
  )

  const totals = computeInvoiceTotals(items, Number(discount), Number(tax))

  const addPreset = (label: string, price: number) => {
    append({ description: label, quantity: 1, unitPrice: price })
  }

  const submit = (values: InvoiceFormValues) => {
    setSubmitting(true)
    const invoice: Invoice = {
      id: generateId('INV'),
      patientId: values.patientId,
      appointmentId: values.appointmentId || undefined,
      date: '2026-08-09',
      dueDate: '2026-08-16',
      items: values.items.map((it) => ({ id: generateId('ITM'), ...it })),
      discount: Number(values.discount),
      tax: Number(values.tax),
      status: 'Pending',
      method: values.method,
      amountPaid: 0,
    }
    setTimeout(() => {
      addInvoice(invoice)
      setSubmitting(false)
      toast.success('Invoice created', `${invoice.id} has been generated successfully.`)
      navigate(`/billing/${invoice.id}`)
    }, 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Create Invoice" description="Generate a new invoice for a patient." breadcrumbs={[{ label: 'Billing', to: '/billing' }, { label: 'Create Invoice' }]} />

      <form onSubmit={handleSubmit(submit)} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader title="Billing Details" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Patient"
                required
                placeholder="Select patient"
                options={patients.map((p) => ({ value: p.id, label: `${getPatientFullName(p)} (${p.id})` }))}
                error={errors.patientId?.message}
                {...register('patientId', { required: 'Please select a patient' })}
              />
              <Select
                label="Appointment"
                placeholder={patientId ? 'Select appointment (optional)' : 'Select a patient first'}
                options={patientAppointments.map((a) => ({ value: a.id, label: `${a.id} — ${formatDate(a.date)} ${a.time}` }))}
                disabled={!patientId}
                {...register('appointmentId')}
              />
              <Select
                label="Payment Method"
                required
                options={paymentMethods.map((m) => ({ value: m, label: m }))}
                {...register('method', { required: true })}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Billing Items" description="Add consultation fees, tests, medication and other charges" />
            <div className="mb-3 flex flex-wrap gap-2">
              {presetItems.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => addPreset(preset.label, preset.price)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-ink hover:border-primary-300 hover:bg-primary-50"
                >
                  + {preset.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
                <span className="col-span-5">Description</span>
                <span className="col-span-2">Quantity</span>
                <span className="col-span-2">Unit Price</span>
                <span className="col-span-2">Total</span>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 items-start gap-2 rounded-lg border border-slate-100 p-2 sm:border-none sm:p-0">
                  <div className="col-span-12 sm:col-span-5">
                    <Input placeholder="Description" {...register(`items.${index}.description`, { required: true })} />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Input type="number" min={1} placeholder="Qty" {...register(`items.${index}.quantity`, { valueAsNumber: true, required: true, min: 1 })} />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Input type="number" min={0} placeholder="Unit Price" {...register(`items.${index}.unitPrice`, { valueAsNumber: true, required: true, min: 0 })} />
                  </div>
                  <div className="col-span-3 flex h-10 items-center text-sm font-medium text-ink sm:col-span-2">
                    {formatCurrency((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0))}
                  </div>
                  <div className="col-span-1 flex h-10 items-center justify-end">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="text-muted hover:text-danger-600" aria-label="Remove item">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" icon={<Plus className="size-4" />} onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="self-start">
                Add Item
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="sticky top-20">
            <CardHeader title="Invoice Summary" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Discount (%)" type="number" min={0} max={100} {...register('discount', { valueAsNumber: true, min: 0, max: 100 })} />
              <Input label="Tax (%)" type="number" min={0} max={100} {...register('tax', { valueAsNumber: true, min: 0, max: 100 })} />
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-ink">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Discount</span>
                <span className="text-danger-600">-{formatCurrency(totals.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Tax</span>
                <span className="text-ink">+{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-ink">
                <span>Grand Total</span>
                <span>{formatCurrency(totals.grandTotal)}</span>
              </div>
            </div>
            <Button type="submit" fullWidth size="lg" loading={submitting} icon={<Receipt className="size-4" />} className="mt-5">
              Generate Invoice
            </Button>
          </Card>
        </div>
      </form>
    </div>
  )
}
