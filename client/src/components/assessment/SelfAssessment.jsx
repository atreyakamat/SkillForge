import { useEffect, useMemo, useState } from 'react'
import SkillRating from './SkillRating.jsx'
import { useNavigate } from 'react-router-dom'
import { useAssessmentContext } from '../../contexts/AssessmentContext.jsx'
import { useSkillContext } from '../../contexts/SkillContext.jsx'

const DRAFT_KEY = 'sf_self_assessment_draft'

// Simple skills list - only 3 basic skills
const SIMPLE_SKILLS = [
  { id: 'javascript', name: 'JavaScript', previous: 0 },
  { id: 'communication', name: 'Communication', previous: 0 },
  { id: 'problem-solving', name: 'Problem Solving', previous: 0 }
]

export default function SelfAssessment() {
  const navigate = useNavigate()
  const { createAssessment } = useAssessmentContext()
  const { addSkill } = useSkillContext()
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Custom skills functionality
  const [customSkills, setCustomSkills] = useState([])
  const [newSkillName, setNewSkillName] = useState('')
  
  // Combine simple skills with custom skills
  const allSkills = [
    ...SIMPLE_SKILLS.map(s => ({ ...s, category: 'Basic Skills' })),
    ...customSkills.map(s => ({ ...s, category: 'Custom Skills' }))
  ]

  // Show all skills - don't filter out any skills
  const visibleSkills = allSkills

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setAnswers(parsed.answers || {})
      }
    } catch {}
  }, [])

  useEffect(() => {
    setSaving(true)
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers }))
      } catch {}
      setSaving(false)
    }, 500)
    return () => clearTimeout(t)
  }, [answers])

  const progress = useMemo(() => {
    const total = visibleSkills.length
    const filled = Object.keys(answers).filter(key => answers[key] && answers[key].value > 0).length
    return Math.round((filled / Math.max(1, total)) * 100)
  }, [answers, visibleSkills])

  function handleChange(skillName, ratingData) {
    // ratingData contains { value, confidence, evidence }
    console.log('handleChange called:', { skillName, ratingData })
    setAnswers(prev => {
      const newAnswers = { 
        ...prev, 
        [skillName]: ratingData 
      }
      console.log('Updated answers:', newAnswers)
      return newAnswers
    })
  }

  function handleDeleteSkill(skillName) {
    console.log('Deleting skill:', skillName)
    setAnswers(prev => {
      const newAnswers = { 
        ...prev, 
        [skillName]: { value: 0, confidence: 'Medium', evidence: '' }
      }
      console.log('Updated answers after deletion:', newAnswers)
      return newAnswers
    })
  }

  function handleAddCustomSkill() {
    if (newSkillName.trim() === '') return
    
    const skillId = `custom-${Date.now()}`
    const newSkill = {
      id: skillId,
      name: newSkillName.trim(),
      previous: 0
    }
    
    setCustomSkills(prev => [...prev, newSkill])
    setNewSkillName('')
  }

  function handleRemoveCustomSkill(skillId) {
    setCustomSkills(prev => prev.filter(skill => skill.id !== skillId))
    // Also remove from answers if it was rated
    const skillName = customSkills.find(s => s.id === skillId)?.name
    if (skillName) {
      setAnswers(prev => {
        const newAnswers = { ...prev }
        delete newAnswers[skillName]
        return newAnswers
      })
    }
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers })) } catch {}
  }

  async function submit(peer = false) {
    console.log('Submit function called with peer:', peer)
    console.log('Current answers:', answers)
    
    // Check if there are any skills to save
    const skillsToSave = Object.keys(answers).filter(key => answers[key] && answers[key].value > 0)
    console.log('Skills to save:', skillsToSave)
    
    if (skillsToSave.length === 0) {
      alert('Please rate at least one skill before submitting!')
      return
    }
    
    setIsSubmitting(true)
    setSubmitted(true)
    
    try {
      // Process all answers and save them as skills
      const skillsToSaveArray = []
      
      console.log('All answers collected:', answers)
      
      for (const [skillName, answer] of Object.entries(answers)) {
        console.log(`Processing skill: ${skillName}`, answer)
        if (answer && answer.value && answer.value > 0) {
          // Find the skill in allSkills to get its category
          const skill = allSkills.find(s => s.name === skillName)
          const category = skill?.category || 'Other'
          
          console.log(`Skill: ${skillName}, Category: ${category}`)
          
          // Convert confidence to numeric value
          const confidenceMap = { 'Low': 3, 'Medium': 5, 'High': 8 }
          const confidence = confidenceMap[answer.confidence] || 5
          
          const skillData = {
            skillName: skillName,
            selfRating: answer.value,
            confidence: confidence,
            evidence: answer.evidence || `Self-assessed skill: ${skillName}`,
            category: category
          }
          
          console.log('Adding skill to save:', skillData)
          skillsToSaveArray.push(skillData)
        }
      }
      
      console.log('Total skills to save:', skillsToSaveArray.length, skillsToSaveArray)
      
      // Save all skills at once using the user skills endpoint
      try {
        console.log('Saving all skills to user profile:', skillsToSaveArray)
        
        // Format skills according to the User model structure
        const formattedSkills = skillsToSaveArray.map(skillData => ({
          name: skillData.skillName,
          selfRating: skillData.selfRating,
          evidence: skillData.evidence,
          confidenceLevel: skillData.confidence === 3 ? 'low' : skillData.confidence === 5 ? 'medium' : 'high'
        }))
        
        console.log('Formatted skills for backend:', formattedSkills)
        
        // Check authentication token
        const accessToken = localStorage.getItem('accessToken')
        console.log('Access token available:', !!accessToken)
        console.log('Access token preview:', accessToken ? accessToken.substring(0, 20) + '...' : 'null')
        
        if (!accessToken) {
          throw new Error('No authentication token found. Please log in again.')
        }
        
        // Use the user skills endpoint instead of individual skill creation
        const endpoint = '/api/skills/me'
        console.log('Calling endpoint:', endpoint)
        console.log('Full URL would be:', window.location.origin + endpoint)
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ skills: formattedSkills })
        })
        
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)
        
        // Read the response body only once
        let responseText
        try {
          responseText = await response.text()
          console.log('Raw response:', responseText)
        } catch (readError) {
          console.error('Failed to read response body:', readError)
          throw new Error('Failed to read server response')
        }
        
        if (!response.ok) {
          let errorMessage = 'Failed to save skills'
          try {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.message || errorMessage
            console.error('Error response:', errorData)
          } catch (jsonError) {
            console.error('Failed to parse error response as JSON:', jsonError)
            console.error('Raw error response:', responseText)
            errorMessage = `Server error (${response.status}) from ${endpoint}: ${responseText}`
          }
          throw new Error(errorMessage)
        }
        
        // Parse success response
        let result
        try {
          result = JSON.parse(responseText)
          console.log('Successfully saved all skills:', result)
        } catch (jsonError) {
          console.error('Failed to parse success response as JSON:', jsonError)
          console.error('Raw success response:', responseText)
          throw new Error(`Invalid JSON response: ${responseText}`)
        }
        
      } catch (error) {
        console.error('Failed to save skills:', error)
        alert(`Failed to save skills: ${error.message}`)
        throw error // Re-throw to trigger the catch block
      }
      
      // Clear the draft
      localStorage.removeItem(DRAFT_KEY)
      
      // Reset submitting state
      setIsSubmitting(false)
      
      // Show success message
      alert(`Successfully saved ${skillsToSaveArray.length} skills!`)
      
      // Show success message and redirect
      setTimeout(() => {
        navigate('/skills') // Redirect to skills page to see the saved skills
      }, 1500)
      
    } catch (error) {
      console.error('Error saving skills:', error)
      setSubmitted(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Skills Assessment</div>
          <div className="text-sm text-gray-600">{saving ? 'Saving draft…' : 'Draft saved'}</div>
        </div>
        <div className="mt-3 h-2 bg-gray-100 rounded">
          <div className="h-2 bg-primary-600 rounded" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Rate your skills from 1 (Novice) to 10 (Expert)
        </div>
        <div className="mt-1 text-xs text-blue-600">
          Debug: {Object.keys(answers).length} answers stored, {Object.keys(answers).filter(key => answers[key] && answers[key].value > 0).length} with ratings
        </div>
      </div>

      {/* Add Custom Skill Input */}
      <div className="bg-white border rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-3">Add Your Own Skills</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Type a skill name (e.g., Python, Leadership, etc.)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
          />
          <button
            onClick={handleAddCustomSkill}
            disabled={!newSkillName.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Skill
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {visibleSkills.map(skill => (
          <SkillRating 
            key={skill.id} 
            name={skill.name} 
            previous={skill.previous} 
            onChange={(ratingData) => handleChange(skill.name, ratingData)}
            onDelete={handleDeleteSkill}
            showDelete={answers[skill.name] && answers[skill.name].value > 0}
            initial={answers[skill.name]?.value || 0}
            isCustom={customSkills.some(cs => cs.id === skill.id)}
            onRemoveCustom={skill.id.startsWith('custom-') ? () => handleRemoveCustomSkill(skill.id) : undefined}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {Object.keys(answers).filter(key => answers[key] && answers[key].value > 0).length} of {visibleSkills.length} skills rated
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-gray-100" disabled={isSubmitting} onClick={saveDraft}>Save Draft</button>
          <button 
            className="px-4 py-2 rounded bg-secondary-600 text-white disabled:bg-gray-400" 
            disabled={isSubmitting || Object.keys(answers).filter(key => answers[key] && answers[key].value > 0).length === 0}
            onClick={()=>submit(false)}
          >
            {isSubmitting ? 'Saving...' : 'Submit Skills'}
          </button>
          <button 
            className="px-4 py-2 rounded bg-primary-600 text-white disabled:bg-gray-400" 
            disabled={isSubmitting || Object.keys(answers).filter(key => answers[key] && answers[key].value > 0).length === 0}
            onClick={()=>submit(true)}
          >
            {isSubmitting ? 'Saving...' : 'Submit for Peer Review'}
          </button>
        </div>
      </div>

      {/* Show summary of skills to be saved */}
      {Object.keys(answers).filter(key => answers[key] && answers[key].value > 0).length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Skills to be saved:</h4>
          <div className="space-y-1">
            {Object.entries(answers)
              .filter(([key, answer]) => answer && answer.value > 0)
              .map(([key, answer]) => {
                const [category, skillName] = key.split(':')
                return (
                  <div key={key} className="text-sm text-blue-800 dark:text-blue-200">
                    • {skillName} (Rating: {answer.value}/10, Confidence: {answer.confidence})
                  </div>
                )
              })
            }
          </div>
        </div>
      )}

      {submitted && (
        <div className="text-sm text-green-700">
          {isSubmitting ? 'Saving your skills to the database...' : 'Assessment submitted successfully! Redirecting to skills page...'}
        </div>
      )}
    </div>
  )
}


