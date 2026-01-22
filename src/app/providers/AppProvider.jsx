import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { AppContext } from './context'

const THEME_KEY = 'appTheme'
const USER_KEY = 'authUser'
const TOKEN_KEY = 'authToken'

function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  const setAuthState = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
  }

  const login = async (credentials, options = {}) => {
    setAuthLoading(true)
    try {
      const { data } = await apiClient.post('/auth/login', credentials, {
        signal: options.signal,
      })
      setAuthState(data.data.user, data.data.token)
      return data.data.user
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (payload, options = {}) => {
    setAuthLoading(true)
    try {
      const { data } = await apiClient.post('/auth/register', payload, {
        signal: options.signal,
      })
      setAuthState(data.data.user, data.data.token)
      return data.data.user
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setAuthState(null, null)
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
      user,
      token,
      isAuthenticated: Boolean(user && token),
      authLoading,
      login,
      register,
      logout,
    }),
    [theme, user, token, authLoading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppProvider as default }
