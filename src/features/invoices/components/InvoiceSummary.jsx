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
          <li key={invoice.id} className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">{invoice.id}</div>
              <div className="text-muted-foreground">{invoice.customer}</div>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">{invoice.status}</span>
              <div className="font-semibold">{invoice.amount}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export { InvoiceSummary }
