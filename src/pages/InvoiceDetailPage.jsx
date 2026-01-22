import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchInvoiceById } from '../features/invoices/api'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

// Status badge component
function StatusBadge({ status, type = 'pdf' }) {
  const statusColors = {
    pdf: {
      not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      queued: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      generated: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    email: {
      not_scheduled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    invoice: {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  }

  const colors = statusColors[type] || statusColors.pdf
  const colorClass = colors[status] || colors.not_started

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status?.replace('_', ' ') || 'N/A'}
    </span>
  )
}

// Info row component
function InfoRow({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <dt className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm sm:text-base font-medium text-foreground break-words text-right sm:text-left">
        {value || <span className="text-muted-foreground italic">N/A</span>}
      </dd>
    </div>
  )
}

// Address display component
function AddressDisplay({ address, label }) {
  // Handle array of addresses or single address object
  const addresses = Array.isArray(address) ? address : address ? [address] : []
  
  // Filter out empty addresses
  const validAddresses = addresses.filter(
    (addr) => addr && (addr.line1 || addr.city || addr.state || addr.postalCode)
  )

  if (validAddresses.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
      <div className="space-y-4">
        {validAddresses.map((addr, index) => (
          <div key={index} className="text-sm text-muted-foreground space-y-1">
            {addr.label && <div className="font-medium">{addr.label}</div>}
            {addr.line1 && <div>{addr.line1}</div>}
            {addr.line2 && <div>{addr.line2}</div>}
            <div>
              {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}
              {addr.country && `, ${addr.country}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const abortControllerRef = useRef(null)

  useEffect(() => {
    // Abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (!id) return

    let isMounted = true

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError('')

    fetchInvoiceById(id, controller.signal)
      .then((data) => {
        if (!isMounted || controller.signal.aborted) return
        setInvoice(data)
      })
      .catch((err) => {
        if (!isMounted || controller.signal.aborted) return
        if (err.name === 'CanceledError' || err.name === 'AbortError') return

        setError(err?.message || 'Unable to load invoice.')
      })
      .finally(() => {
        if (!isMounted || controller.signal.aborted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
    }
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const formatCurrency = (amount) => {
    if (amount == null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading invoice details…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" onClick={() => navigate('/invoices/all')}>
            Back to All Invoices
          </Button>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">Invoice not found</p>
          <Button size="sm" onClick={() => navigate('/invoices/all')}>
            Back to All Invoices
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Invoice Details</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {invoice.invoiceNumber}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={() => navigate('/invoices/all')} className="w-full sm:w-auto">
            Back to All
          </Button>
          <Button size="sm" onClick={() => navigate('/invoices')} className="w-full sm:w-auto">
            Create New
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Basic Information */}
        <Card title="Basic Information" className="lg:col-span-2">
          <dl className="space-y-3 sm:space-y-4">
            <InfoRow label="Invoice ID" value={<span className="font-mono text-xs">{invoice.id}</span>} />
            <InfoRow label="Invoice Number" value={invoice.invoiceNumber} />
            <InfoRow label="Company Name" value={invoice.companyName} />
            <InfoRow label="Amount" value={formatCurrency(invoice.amount)} />
            <InfoRow
              label="Status"
              value={<StatusBadge status={invoice.status} type="invoice" />}
            />
            <InfoRow label="Email To" value={invoice.emailTo} />
          </dl>
        </Card>

        {/* Dates & Timeline */}
        <Card title="Dates & Timeline">
          <dl className="space-y-3 sm:space-y-4">
            <InfoRow label="Entered At" value={formatDate(invoice.enteredAt)} />
            <InfoRow label="Pickup Date" value={formatDate(invoice.pickupAt)} />
            <InfoRow label="Email Expected Date" value={formatDate(invoice.expectedEmailAt)} />
            <InfoRow label="Email Sent Date" value={formatDate(invoice.emailSentAt)} />
            <InfoRow label="PDF Generated At" value={formatDate(invoice.pdfGeneratedAt)} />
            <InfoRow label="Created At" value={formatDate(invoice.createdAt)} />
            <InfoRow label="Updated At" value={formatDate(invoice.updatedAt)} />
          </dl>
        </Card>

        {/* Status Tracking */}
        <Card title="Status Tracking">
          <dl className="space-y-3 sm:space-y-4">
            <InfoRow
              label="PDF Generation Status"
              value={<StatusBadge status={invoice.generationStatus} type="pdf" />}
            />
            <InfoRow
              label="Email Status"
              value={<StatusBadge status={invoice.emailStatus} type="email" />}
            />
            {invoice.generationAttempts > 0 && (
              <InfoRow label="PDF Generation Attempts" value={invoice.generationAttempts} />
            )}
            {invoice.emailAttempts > 0 && (
              <InfoRow label="Email Attempts" value={invoice.emailAttempts} />
            )}
            {invoice.generationLastError && (
              <div className="flex flex-col gap-1">
                <dt className="text-xs sm:text-sm font-medium text-muted-foreground">
                  PDF Generation Error
                </dt>
                <dd className="text-sm text-destructive break-words">
                  {invoice.generationLastError}
                </dd>
              </div>
            )}
            {invoice.emailLastError && (
              <div className="flex flex-col gap-1">
                <dt className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Email Error
                </dt>
                <dd className="text-sm text-destructive break-words">{invoice.emailLastError}</dd>
              </div>
            )}
            {invoice.pdfBlobPath && (
              <InfoRow label="PDF Path" value={<span className="font-mono text-xs break-all">{invoice.pdfBlobPath}</span>} />
            )}
          </dl>
        </Card>

        {/* Addresses */}
        {(invoice.departingAddress || invoice.destinationAddress) && (
          <Card title="Addresses" className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {invoice.departingAddress && (
                <AddressDisplay address={invoice.departingAddress} label="Departing Address" />
              )}
              {invoice.destinationAddress && (
                <AddressDisplay address={invoice.destinationAddress} label="Destination Address" />
              )}
            </div>
          </Card>
        )}

        {/* Items */}
        {invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0 && (
          <Card title="Line Items" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="border-b border-border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </th>
                    <th className="border-b border-border px-3 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Quantity
                    </th>
                    <th className="border-b border-border px-3 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Unit Price
                    </th>
                    <th className="border-b border-border px-3 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoice.items.map((item, index) => {
                    const quantity = Number(item.quantity) || 0
                    const unitPrice = Number(item.unitPrice) || 0
                    const total = quantity * unitPrice

                    return (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">
                          {item.description || 'N/A'}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-right">
                          {quantity}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-right">
                          {formatCurrency(unitPrice)}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-medium text-right">
                          {formatCurrency(total)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-muted/30">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-semibold text-right"
                    >
                      Grand Total:
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-bold text-right">
                      {formatCurrency(invoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default InvoiceDetailPage
