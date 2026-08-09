import type { Invoice, InvoiceItem } from '@/types'

export function itemTotal(item: Pick<InvoiceItem, 'quantity' | 'unitPrice'>): number {
  return item.quantity * item.unitPrice
}

export function invoiceSubtotal(items: Pick<InvoiceItem, 'quantity' | 'unitPrice'>[]): number {
  return items.reduce((sum, item) => sum + itemTotal(item), 0)
}

export interface InvoiceTotals {
  subtotal: number
  discountAmount: number
  taxAmount: number
  grandTotal: number
}

export function computeInvoiceTotals(
  items: Pick<InvoiceItem, 'quantity' | 'unitPrice'>[],
  discountPercent: number,
  taxPercent: number,
): InvoiceTotals {
  const subtotal = invoiceSubtotal(items)
  const discountAmount = (subtotal * discountPercent) / 100
  const taxAmount = ((subtotal - discountAmount) * taxPercent) / 100
  const grandTotal = subtotal - discountAmount + taxAmount
  return { subtotal, discountAmount, taxAmount, grandTotal }
}

export function invoiceGrandTotal(invoice: Invoice): number {
  return computeInvoiceTotals(invoice.items, invoice.discount, invoice.tax).grandTotal
}

export function invoiceBalance(invoice: Invoice): number {
  return Math.max(invoiceGrandTotal(invoice) - invoice.amountPaid, 0)
}
