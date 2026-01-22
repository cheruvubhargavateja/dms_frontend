import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAppContext } from '../app/providers/useAppContext'

function HomePage() {
  const { user } = useAppContext()
  const navigate = useNavigate()
  const displayName = user?.firstName ? `${user.firstName}` : user?.email || 'User'

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Welcome back, {displayName}</h1>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card title="Invoices" description="Track billing and payments.">
          <p className="text-sm sm:text-base mb-4">View recent invoices, statuses, and totals at a glance.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" onClick={() => navigate('/invoices')} className="w-full sm:w-auto">
              Create Invoice
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/invoices/all')} className="w-full sm:w-auto">
              View all
            </Button>
          </div>
        </Card>
        <Card title="Settings" description="Manage preferences and team access.">
          <p className="text-sm sm:text-base mb-4">Configure appearance, notifications, and access controls.</p>
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="w-full sm:w-auto">
            Go to settings
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
