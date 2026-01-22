import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { InvoiceForm } from '../features/invoices/components/InvoiceForm'
import { InvoiceList } from '../features/invoices/components/InvoiceList'

function InvoicesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreated = () => {
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button size="md">New invoice</Button>
      </div>
      <InvoiceForm onCreated={handleCreated} />
      <InvoiceList refreshKey={refreshKey} />
    </div>
  )
}

export default InvoicesPage
