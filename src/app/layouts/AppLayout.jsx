import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../providers/useAppContext'
import { AppShell } from '../../components/ui/AppShell'
import { ThemeToggle } from '../../features/settings/components/ThemeToggle'
import { APP_NAME, NAV_LINKS } from '../../lib/constants'

function AppLayout() {
  const { user, logout } = useAppContext()

  return (
    <AppShell
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">{APP_NAME}</div>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </div>
      }
      navigation={
        <nav className="flex gap-3 text-sm font-medium">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')
              }
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      }
    >
      <Outlet />
    </AppShell>
  )
}

export default AppLayout
