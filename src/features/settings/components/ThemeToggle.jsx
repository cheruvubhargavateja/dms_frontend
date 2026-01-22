import { Moon, Sun } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useAppContext } from '../../../app/providers/useAppContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext()

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </div>
      )}
    </Button>
  )
}

export { ThemeToggle }
