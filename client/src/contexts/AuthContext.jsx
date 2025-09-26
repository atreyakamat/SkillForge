import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getStoredToken, removeStoredToken, setStoredToken } from '../utils/storage.js'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      setStoredToken(token)
      api.setToken(token)
      // TODO: fetch current user profile
      setUser({ email: 'user@example.com' })
    } else {
      removeStoredToken()
      api.setToken(null)
      setUser(null)
    }
  }, [token])

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    login: async (email, password) => {
      // TODO: integrate with backend /auth/login
      void email; void password
      const fakeToken = 'dev-token'
      setToken(fakeToken)
    },
    register: async (email, password) => {
      // TODO: integrate with backend /auth/register
      void email; void password
      const fakeToken = 'dev-token'
      setToken(fakeToken)
    },
    logout: () => setToken(null)
  }), [token, user])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

