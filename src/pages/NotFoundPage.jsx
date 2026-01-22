import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">The route you requested does not exist.</p>
      <Button asChild variant="primary">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
