import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../app/providers/useAppContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

function RegisterPage() {
  const { register, authLoading, isAuthenticated } = useAppContext()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const abortRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await register(form, { signal: controller.signal })
      navigate(redirectPath, { replace: true })
    } catch (err) {
      if (err.name === 'CanceledError') return
      setError(err.message)
    } finally {
      abortRef.current = null
    }
  }

  const handleAbort = () => {
    abortRef.current?.abort()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8 sm:py-12">
      <Card
        title="Create account"
        description="Set up your profile to access invoices and settings."
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium block" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium block" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium block" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p> : null}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <Button type="submit" disabled={authLoading} className="flex-1 w-full sm:w-auto">
              {authLoading ? 'Creating…' : 'Create account'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleAbort} disabled={!abortRef.current} className="w-full sm:w-auto">
              Abort
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-left pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
