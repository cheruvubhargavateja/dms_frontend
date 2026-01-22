import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { fetchInvoices } from '../api'

function InvoiceList({ refreshKey = 0 }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')

    fetchInvoices()
      .then((data) => {
        if (isMounted) setInvoices(data)
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Unable to load invoices.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return (
    <Card
      title="Recent invoices"
      description="Live data from the invoices API. New submissions appear here."
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading invoices…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No invoices yet. Create your first one above.</p>
      ) : (
        <ul className="divide-y divide-border text-sm">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="font-semibold">{invoice.invoiceNumber}</div>
                {invoice.companyName && <div className="text-muted-foreground">{invoice.companyName}</div>}
                <div className="text-xs text-muted-foreground">
                  Amount: ${invoice.amount} · Status: {invoice.status}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Entered: {invoice.enteredAt ? new Date(invoice.enteredAt).toLocaleString() : 'N/A'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export { InvoiceList }
