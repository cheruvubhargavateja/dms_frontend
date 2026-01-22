import { Card } from '../components/ui/Card'
import { ThemeToggle } from '../features/settings/components/ThemeToggle'
import { useAppContext } from '../app/providers/useAppContext'

function SettingsPage() {
  const { theme, user } = useAppContext()
  const displayName =
    user?.firstName || user?.lastName ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : user?.email

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Settings</h1>
      <Card title="Theme" description="Toggle light and dark modes.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="font-medium capitalize text-sm sm:text-base">{theme} mode</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Applied across the app using a single provider.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>
      <Card title="Account" description="Example of shared context values.">
        <p className="text-sm sm:text-base">
          Logged in as <span className="font-medium">{displayName}</span>
          {user?.role ? ` (${user.role})` : null}
        </p>
      </Card>
    </div>
  )
}

export default SettingsPage
