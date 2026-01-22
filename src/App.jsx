import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AppLayout from './app/layouts/AppLayout'
import AppProvider from './app/providers/AppProvider'
import { ProtectedRoute } from './app/routes/ProtectedRoute'

// Lazy load all pages
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const InvoicesPage = lazy(() => import('./pages/InvoicesPage'))
const InvoicesTablePage = lazy(() => import('./pages/InvoicesTablePage'))
const InvoiceDetailPage = lazy(() => import('./pages/InvoiceDetailPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Public routes (no authentication required)
const publicRoutes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
]

// Protected routes (authentication required)
const protectedRoutes = [
  { path: '/', component: HomePage },
  { path: '/invoices', component: InvoicesPage },
  { path: '/invoices/all', component: InvoicesTablePage },
  { path: '/invoices/:id', component: InvoiceDetailPage },
  { path: '/settings', component: SettingsPage },
  { path: '*', component: NotFoundPage },
]

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg">Loading...</div>
  </div>
)

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            {publicRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            
            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {protectedRoutes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
