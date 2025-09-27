import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext.jsx'
import skillsAPI from '../services/skillsAPI.js'

export default function Skills() {
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()
  const [userSkills, setUserSkills] = useState([])
  const [availableSkills, setAvailableSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [skillRating, setSkillRating] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
  }, [isAuthenticated, navigate])

  // Fetch user skills and available skills
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        
        // Fetch user's current skills
        const userSkillsResponse = await skillsAPI.getUserSkills()
        if (userSkillsResponse.success) {
          setUserSkills(userSkillsResponse.skills || [])
        }
        
        // Fetch all available skills
        const allSkillsResponse = await skillsAPI.getAllSkills()
        if (allSkillsResponse.success) {
          setAvailableSkills(allSkillsResponse.skills || [])
        }
        
      } catch (error) {
        console.error('Error fetching skills:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      
      let skillToAdd = null
      
      if (selectedSkill) {
        // Adding an existing skill
        skillToAdd = availableSkills.find(skill => skill._id === selectedSkill)
      } else if (newSkillName.trim()) {
        // Creating a new skill
        const createResponse = await skillsAPI.createSkill({
          name: newSkillName.trim(),
          category: 'Other'
        })
        
        if (createResponse.success) {
          skillToAdd = createResponse.skill
          // Refresh available skills
          const allSkillsResponse = await skillsAPI.getAllSkills()
          if (allSkillsResponse.success) {
            setAvailableSkills(allSkillsResponse.skills || [])
          }
        }
      }
      
      if (skillToAdd) {
        // Add skill to user's profile
        const addResponse = await skillsAPI.addUserSkill({
          skillId: skillToAdd._id,
          selfRating: skillRating
        })
        
        if (addResponse.success) {
          // Refresh user skills
          const userSkillsResponse = await skillsAPI.getUserSkills()
          if (userSkillsResponse.success) {
            setUserSkills(userSkillsResponse.skills || [])
          }
          
          // Reset form
          setSelectedSkill('')
          setNewSkillName('')
          setSkillRating(1)
          setShowAddModal(false)
        }
      }
      
    } catch (error) {
      console.error('Error adding skill:', error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSkill = async (skillId, newRating) => {
    try {
      await skillsAPI.updateUserSkill(skillId, { selfRating: newRating })
      
      // Refresh user skills
      const userSkillsResponse = await skillsAPI.getUserSkills()
      if (userSkillsResponse.success) {
        setUserSkills(userSkillsResponse.skills || [])
      }
    } catch (error) {
      console.error('Error updating skill:', error)
      setError(error.message)
    }
  }

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return
    
    try {
      await skillsAPI.removeUserSkill(skillId)
      
      // Refresh user skills
      const userSkillsResponse = await skillsAPI.getUserSkills()
      if (userSkillsResponse.success) {
        setUserSkills(userSkillsResponse.skills || [])
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
      setError(error.message)
    }
  }

  const getRatingLabel = (rating) => {
    if (rating >= 9) return 'Expert'
    if (rating >= 7) return 'Advanced'
    if (rating >= 5) return 'Intermediate'
    if (rating >= 3) return 'Novice'
    return 'Beginner'
  }

  const getRatingColor = (rating) => {
    if (rating >= 9) return 'bg-purple-100 text-purple-800'
    if (rating >= 7) return 'bg-blue-100 text-blue-800'
    if (rating >= 5) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your skills...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
              <p className="text-gray-600 mt-2">Manage your skills and track your progress</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Skills List */}
        <div className="bg-white rounded-lg shadow-sm">
          {userSkills.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your profile by adding your skills and expertise levels.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Add Your First Skill
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Skills ({userSkills.length})</h2>
              <div className="grid gap-4">
                {userSkills.map((skill) => (
                  <div key={skill.skillId || skill.skillName} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{skill.skillName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(skill.selfRating)}`}>
                            {getRatingLabel(skill.selfRating)} ({skill.selfRating}/10)
                          </span>
                          {skill.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {skill.category}
                            </span>
                          )}
                        </div>
                        
                        {/* Rating Slider */}
                        <div className="mt-3">
                          <label className="block text-sm text-gray-600 mb-1">
                            Skill Level: {skill.selfRating}/10
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={skill.selfRating || 1}
                            onChange={(e) => handleUpdateSkill(skill.skillId, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Beginner</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSkill(skill.skillId)}
                        className="ml-4 text-red-600 hover:text-red-800 p-2"
                        title="Remove skill"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Skill Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
              
              <form onSubmit={handleAddSkill} className="space-y-4">
                {/* Existing Skill Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select from existing skills:
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => {
                      setSelectedSkill(e.target.value)
                      setNewSkillName('') // Clear custom skill name
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  >
                    <option value="">Choose a skill...</option>
                    {availableSkills.map((skill) => (
                      <option key={skill._id} value={skill._id}>
                        {skill.name} ({skill.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* OR Divider */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Custom Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add a new skill:
                  </label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => {
                      setNewSkillName(e.target.value)
                      setSelectedSkill('') // Clear selected skill
                    }}
                    placeholder="e.g., Python, Leadership, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                {/* Skill Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your skill level: {skillRating}/10 ({getRatingLabel(skillRating)})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={skillRating}
                    onChange={(e) => setSkillRating(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setSelectedSkill('')
                      setNewSkillName('')
                      setSkillRating(1)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!selectedSkill && !newSkillName.trim())}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Skill'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}