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
      setUser((prev)=> prev || { email: 'you@skillforge.dev' })
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
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.accessToken)
    },
    register: async (email, password) => {
      const { data } = await api.post('/auth/register', { name: email.split('@')[0], email, password })
      setToken(data.accessToken)
    },
    logout: async () => {
      try { await api.post('/auth/logout', {}) } catch {}
      setToken(null)
    }
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

