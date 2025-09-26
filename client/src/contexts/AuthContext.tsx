import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import api from '../services/api.js'
import { getStoredToken, removeStoredToken, setStoredToken } from '../utils/storage.js'

export type User = {
  id?: string
  name?: string
  email: string
  role?: 'Developer' | 'Designer' | 'Manager' | string
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string
  login: (params: { email: string; password: string; remember: boolean }) => Promise<void>
  register: (params: { name: string; email: string; password: string; role: string }) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken())
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<string>('')
  const rememberRef = useRef<boolean>(true)

  // Apply token to API and try to fetch current user on mount
  useEffect(() => {
    api.setToken(token)
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [token])

  // Persist token depending on remember setting
  useEffect(() => {
    if (token && rememberRef.current) {
      setStoredToken(token)
    } else if (!token) {
      removeStoredToken()
    }
  }, [token])

  async function login({ email, password, remember }: { email: string; password: string; remember: boolean }) {
    setLoading(true)
    setError('')
    rememberRef.current = remember
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const receivedToken: string = data?.token
      const receivedUser: User | null = data?.user || null
      setToken(receivedToken)
      setUser(receivedUser)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function register({ name, email, password, role }: { name: string; email: string; password: string; role: string }) {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      const receivedToken: string = data?.token
      const receivedUser: User | null = data?.user || null
      setToken(receivedToken)
      setUser(receivedUser)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function refreshToken() {
    if (!token) return
    try {
      const { data } = await api.post('/auth/refresh')
      const newToken: string = data?.token
      setToken(newToken)
    } catch (err) {
      // Refresh failed; logout
      setToken(null)
      setUser(null)
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    removeStoredToken()
  }

  const value: AuthContextValue = useMemo(() => ({
    isAuthenticated: Boolean(token),
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken
  }), [token, user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
