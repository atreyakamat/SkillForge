import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getStoredToken, removeStoredToken, setStoredToken } from '../utils/storage.js'

const AuthContext = createContext(null)

const API_BASE_URL = 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      setStoredToken(token)
      // TODO: fetch current user profile
      setUser((prev)=> prev || { email: 'you@skillforge.dev' })
    } else {
      removeStoredToken()
      setUser(null)
    }
  }, [token])

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    login: async (email, password) => {
      console.log('🔐 AuthContext login called with:', { email })
      try {
        console.log('📡 Making API call to /auth/login')
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        console.log('📊 Login response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Login error:', errorData)
          throw new Error(errorData.message || 'Login failed')
        }

        const data = await response.json()
        console.log('📥 Login response received:', data)
        console.log('🔑 Setting access token:', data.tokens?.access ? 'present' : 'missing')
        
        setToken(data.tokens.access)
        setUser(data.user)
      } catch (error) {
        console.error('❌ AuthContext login error:', error)
        throw error
      }
    },
    register: async (registrationData) => {
      console.log('🔐 AuthContext register called with:', registrationData)
      try {
        console.log('📡 Making API call to /auth/register')
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        })

        console.log('📊 Registration response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Registration error:', errorData)
          throw new Error(errorData.message || 'Registration failed')
        }

        const data = await response.json()
        console.log('📥 Registration response received:', data)
        console.log('🔑 Setting access token:', data.tokens?.access ? 'present' : 'missing')
        
        setToken(data.tokens.access)
        setUser(data.user)
      } catch (error) {
        console.error('❌ AuthContext register error:', error)
        throw error
      }
    },
    logout: async () => {
      try {
        if (token) {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
        }
      } catch (error) {
        console.log('Logout API call failed, but continuing with local logout')
      }
      setToken(null)
      setUser(null)
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
