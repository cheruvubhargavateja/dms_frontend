import { Card } from '../../../components/ui/Card'

const demoInvoices = [
  { id: 'INV-1042', customer: 'Acme Corp', status: 'Paid', amount: '$3,200' },
  { id: 'INV-1043', customer: 'Globex', status: 'Pending', amount: '$980' },
  { id: 'INV-1044', customer: 'Initech', status: 'Overdue', amount: '$1,540' },
]

function InvoiceSummary() {
  return (
    <Card title="Recent invoices" description="Sample data for structure illustration">
      <ul className="divide-y divide-border text-sm">
        {demoInvoices.map((invoice) => (
          <li key={invoice.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="font-medium">{invoice.id}</div>
              <div className="text-muted-foreground text-xs sm:text-sm">{invoice.customer}</div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">{invoice.status}</span>
              <div className="font-semibold">{invoice.amount}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export { InvoiceSummary }
