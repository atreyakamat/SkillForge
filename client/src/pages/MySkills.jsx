import React, { useState, useEffect } from 'react'
import { useSkillContext } from '../contexts/SkillContext'

export default function MySkills() {
  const { userSkills, loading, fetchUserSkills, deleteSkill } = useSkillContext()
  const [skillsByCategory, setSkillsByCategory] = useState({})

  useEffect(() => {
    fetchUserSkills()
  }, [fetchUserSkills])

  useEffect(() => {
    // Group skills by category
    const grouped = userSkills.reduce((acc, skill) => {
      const category = skill.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    }, {})
    setSkillsByCategory(grouped)
  }, [userSkills])

  const getProficiencyStatus = (rating) => {
    const percentage = (rating / 10) * 100
    if (percentage >= 80) return { status: 'Strong', color: 'green' }
    if (percentage >= 50) return { status: 'Average', color: 'yellow' }
    return { status: 'Weak', color: 'red' }
  }

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId)
      } catch (error) {
        console.error('Error deleting skill:', error)
      }
    }
  }

  const categories = Object.keys(skillsByCategory)

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Skills</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">A comprehensive view of your skills and proficiency levels.</p>
        </div>
      </div>

      {loading.userSkills ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading your skills...</p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">psychology</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No skills found</h3>
          <p className="text-gray-500 dark:text-gray-400">You don't have any skills in your profile yet.</p>
        </div>
      ) : (
        categories.map(category => (
          <div key={category} className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h2>
              <button className="flex h-8 items-center justify-center gap-1 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-gray-50 dark:divide-gray-800 dark:bg-gray-900/30">
                  {skillsByCategory[category].map(skill => {
                    const percentage = (skill.selfRating / 10) * 100
                    const status = getProficiencyStatus(skill.selfRating)
                    return (
                      <tr key={skill.skillId}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {skill.skillName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div className="h-2 rounded-full bg-primary-600" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(percentage)}%</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            status.color === 'green' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : status.color === 'yellow'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {status.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteSkill(skill.skillId)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  )
}


