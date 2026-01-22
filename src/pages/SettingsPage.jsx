import { Card } from '../components/ui/Card'
import { ThemeToggle } from '../features/settings/components/ThemeToggle'
import { useAppContext } from '../app/providers/useAppContext'

function SettingsPage() {
  const { theme, user } = useAppContext()
  const displayName =
    user?.firstName || user?.lastName ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : user?.email

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card title="Theme" description="Toggle light and dark modes.">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium capitalize">{theme} mode</div>
            <p className="text-sm text-muted-foreground">
              Applied across the app using a single provider.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>
      <Card title="Account" description="Example of shared context values.">
        <p className="text-sm">
          Logged in as <span className="font-medium">{displayName}</span>
          {user?.role ? ` (${user.role})` : null}
        </p>
      </Card>
    </div>
  )
}

export default SettingsPage
