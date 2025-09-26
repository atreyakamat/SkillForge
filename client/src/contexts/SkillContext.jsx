import React, { createContext, useContext, useMemo, useState } from 'react'

const SkillContext = createContext(null)

export function SkillProvider({ children }) {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const value = useMemo(() => ({
    skills,
    loading,
    error,
    setSkills,
    setLoading,
    setError
  }), [skills, loading, error])

  return (
    <SkillContext.Provider value={value}>{children}</SkillContext.Provider>
  )
}

export function useSkillContext() {
  const ctx = useContext(SkillContext)
  if (!ctx) throw new Error('useSkillContext must be used within SkillProvider')
  return ctx
}


