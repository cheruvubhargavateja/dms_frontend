import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAppContext } from '../app/providers/useAppContext'

function HomePage() {
  const { user } = useAppContext()
  const displayName = user?.firstName ? `${user.firstName}` : user?.email || 'User'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome back, {displayName}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Invoices" description="Track billing and payments.">
          <p>View recent invoices, statuses, and totals at a glance.</p>
          <div className="flex gap-2">
            <Button size="sm">Create Invoice</Button>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
        </Card>
        <Card title="Settings" description="Manage preferences and team access.">
          <p>Configure appearance, notifications, and access controls.</p>
          <Button variant="ghost" size="sm">
            Go to settings
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
