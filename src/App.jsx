import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './app/layouts/AppLayout'
import AppProvider from './app/providers/AppProvider'
import { ProtectedRoute } from './app/routes/ProtectedRoute'
import HomePage from './pages/HomePage'
import InvoicesPage from './pages/InvoicesPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
