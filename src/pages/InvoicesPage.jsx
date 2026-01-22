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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">Invoices</h1>
        <Button size="sm" className="w-full sm:w-auto">New invoice</Button>
      </div>
      <InvoiceForm onCreated={handleCreated} />
      <InvoiceList refreshKey={refreshKey} />
    </div>
  )
}

export default InvoicesPage
