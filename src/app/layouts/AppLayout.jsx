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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 min-w-0">
            <div className="text-base sm:text-lg font-semibold truncate">{APP_NAME}</div>
            <span className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              className="rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      }
      navigation={
        <nav className="flex flex-wrap gap-2 text-xs sm:text-sm font-medium">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
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
