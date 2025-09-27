import React, { useState, useEffect } from 'react'
import { useSkillContext } from '../../contexts/SkillContext'
import { useAuthContext } from '../../contexts/AuthContext'
import analyticsAPI from '../../services/analyticsAPI'

// AI-Powered Schedule Maker Component - Updated for correct imports

const ScheduleMaker = () => {
  const { skills } = useSkillContext()
  const { user } = useAuthContext()
  const [selectedSkills, setSelectedSkills] = useState([])
  const [schedule, setSchedule] = useState(null)
  const [preferences, setPreferences] = useState({
    hoursPerWeek: 10,
    sessionDuration: 60,
    preferredTimes: ['evening'],
    intensity: 'moderate',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [gapAnalysis, setGapAnalysis] = useState(null)
  


  // Load skill gaps on component mount
  useEffect(() => {
    loadGapAnalysis()
  }, [])

  const loadGapAnalysis = async () => {
    try {
      // Mock gap analysis if API is not available
      const mockGapAnalysis = {
        gaps: [
          {
            skill: 'React Advanced Patterns',
            category: 'Frontend Development',
            currentLevel: 2,
            requiredLevel: 4,
            priority: 'critical',
            estimatedLearningTime: 40
          },
          {
            skill: 'Node.js Performance',
            category: 'Backend Development', 
            currentLevel: 1,
            requiredLevel: 3,
            priority: 'high',
            estimatedLearningTime: 30
          },
          {
            skill: 'Database Design',
            category: 'Data Management',
            currentLevel: 2,
            requiredLevel: 4,
            priority: 'medium',
            estimatedLearningTime: 25
          }
        ]
      }
      
      setGapAnalysis(mockGapAnalysis)
      
      // Auto-select critical gap skills
      if (mockGapAnalysis?.gaps) {
        const criticalSkills = mockGapAnalysis.gaps
          .filter(gap => gap.priority === 'critical')
          .slice(0, 3)
          .map(gap => ({
            name: gap.skill,
            category: gap.category,
            currentLevel: gap.currentLevel,
            targetLevel: gap.requiredLevel,
            priority: gap.priority,
            estimatedTime: gap.estimatedLearningTime
          }))
        setSelectedSkills(criticalSkills)
      }
    } catch (error) {
      console.error('Failed to load gap analysis:', error)
      // Set default mock data on error
      setGapAnalysis({
        gaps: [
          {
            skill: 'JavaScript ES6+',
            category: 'Programming',
            currentLevel: 1,
            requiredLevel: 3,
            priority: 'high',
            estimatedLearningTime: 20
          }
        ]
      })
    }
  }

  const generateSchedule = async () => {
    if (selectedSkills.length === 0) return

    setLoading(true)
    try {
      // Simulate AI-powered schedule generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const totalHours = preferences.hoursPerWeek * 
        (Math.ceil((new Date(preferences.endDate) - new Date(preferences.startDate)) / (7 * 24 * 60 * 60 * 1000)))
      
      const skillHours = Math.floor(totalHours / selectedSkills.length)
      
      const generatedSchedule = {
        totalDuration: `${Math.ceil(totalHours / preferences.hoursPerWeek)} weeks`,
        totalHours,
        weeklyPlan: generateWeeklyPlan(),
        milestones: generateMilestones(),
        resources: generateResources(),
        assessmentSchedule: generateAssessmentSchedule()
      }

      setSchedule(generatedSchedule)
      setCurrentStep(4)
    } catch (error) {
      console.error('Failed to generate schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyPlan = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const sessions = Math.ceil(preferences.hoursPerWeek / (preferences.sessionDuration / 60))
    const sessionsPerDay = Math.ceil(sessions / 7)

    return days.map(day => ({
      day,
      sessions: Array.from({ length: sessionsPerDay }, (_, i) => {
        const skill = selectedSkills[i % selectedSkills.length]
        const timeSlot = preferences.preferredTimes.includes('morning') ? '09:00-10:00' :
                        preferences.preferredTimes.includes('afternoon') ? '14:00-15:00' :
                        '19:00-20:00'
        
        return {
          time: timeSlot,
          skill: skill.name,
          activity: getActivityForSkill(skill),
          duration: preferences.sessionDuration,
          difficulty: skill.priority === 'critical' ? 'High' : 'Medium'
        }
      }).filter((_, i) => i < 2) // Max 2 sessions per day
    }))
  }

  const getActivityForSkill = (skill) => {
    const activities = {
      'JavaScript': 'Build interactive project',
      'React': 'Component development',
      'Python': 'Algorithm practice',
      'AWS': 'Hands-on lab exercise',
      'Docker': 'Container deployment',
      'TypeScript': 'Type safety refactoring'
    }
    return activities[skill.name] || 'Practice exercises'
  }

  const generateMilestones = () => {
    return selectedSkills.map((skill, index) => ({
      week: (index + 1) * 3,
      skill: skill.name,
      target: `Reach level ${Math.min(10, skill.currentLevel + 2)}`,
      assessment: 'Practical project completion',
      reward: '🎯 Skill Badge Earned'
    }))
  }

  const generateResources = () => {
    return selectedSkills.flatMap(skill => [
      {
        type: 'Course',
        title: `Advanced ${skill.name}`,
        provider: 'SkillForge Academy',
        duration: '4 hours',
        difficulty: skill.priority === 'critical' ? 'Intermediate' : 'Beginner'
      },
      {
        type: 'Practice',
        title: `${skill.name} Coding Challenges`,
        provider: 'Interactive Labs',
        duration: '2 hours/week',
        difficulty: 'Progressive'
      }
    ])
  }

  const generateAssessmentSchedule = () => {
    return Array.from({ length: 4 }, (_, i) => ({
      week: (i + 1) * 3,
      type: i === 3 ? 'Final Assessment' : 'Progress Check',
      skills: selectedSkills.map(s => s.name),
      format: 'Practical + Peer Review',
      duration: '90 minutes'
    }))
  }

  const addSkillToSchedule = (skill) => {
    if (selectedSkills.find(s => s.name === skill.name)) return
    
    const skillData = {
      name: skill.name,
      category: skill.category || 'General',
      currentLevel: skill.selfRating || 0,
      targetLevel: Math.min(10, (skill.selfRating || 0) + 3),
      priority: 'moderate',
      estimatedTime: '4 weeks'
    }
    
    setSelectedSkills([...selectedSkills, skillData])
  }

  const removeSkill = (skillName) => {
    setSelectedSkills(selectedSkills.filter(s => s.name !== skillName))
  }

  const StepIndicator = ({ step, title, completed }) => (
    <div className={`flex items-center space-x-3 ${completed ? 'text-green-600' : currentStep === step ? 'text-blue-600' : 'text-gray-400'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        completed ? 'bg-green-100 border-2 border-green-500' :
        currentStep === step ? 'bg-blue-100 border-2 border-blue-500' :
        'bg-gray-100 border-2 border-gray-300'
      }`}>
        {completed ? '✓' : step}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 magical-fade-in">
      {/* Header */}
      <div className="text-center magical-slide-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 magical-glow">
          ✨ AI-Powered Study Schedule Maker
        </h1>
        <p className="text-gray-600 text-lg magical-float">
          Create a personalized learning plan tailored to your skill gaps and goals
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <StepIndicator step={1} title="Select Skills" completed={currentStep > 1} />
          <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
          <StepIndicator step={2} title="Set Preferences" completed={currentStep > 2} />
          <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
          <StepIndicator step={3} title="Generate Plan" completed={currentStep > 3} />
          <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
          <StepIndicator step={4} title="Your Schedule" completed={currentStep === 4} />
        </div>
      </div>

      {/* Step 1: Skill Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Select Skills to Focus On</h2>
            
            {gapAnalysis?.gaps && gapAnalysis.gaps.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-red-700 mb-3">🚨 Critical Skills (Auto-selected)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gapAnalysis.gaps.filter(gap => gap.priority === 'critical').map((gap, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-red-900">{gap.skill}</span>
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                          Gap: {gap.gap}
                        </span>
                      </div>
                      <div className="text-sm text-red-700 mt-1">
                        Current: {gap.currentLevel}/10 → Target: {gap.requiredLevel}/10
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">📚 Your Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills && skills.length > 0 ? skills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => addSkillToSchedule(skill)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-medium text-gray-900">{skill.name}</div>
                    <div className="text-sm text-gray-600">Level {skill.selfRating || 0}/10</div>
                  </button>
                )) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">📚</div>
                    <p className="text-gray-500">No skills found. Add some skills to get started!</p>
                    <button 
                      onClick={() => {
                        const sampleSkills = [
                          { name: 'JavaScript', category: 'Programming', selfRating: 3 },
                          { name: 'React', category: 'Frontend', selfRating: 4 },
                          { name: 'Node.js', category: 'Backend', selfRating: 2 }
                        ]
                        sampleSkills.forEach(skill => addSkillToSchedule(skill))
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Sample Skills
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">🎯 Selected Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => removeSkill(skill.name)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              disabled={selectedSkills.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Preferences ({selectedSkills.length} skills selected)
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preferences */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">⚙️ Customize Your Learning Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Hours per Week
              </label>
              <input
                type="range"
                min="5"
                max="40"
                value={preferences.hoursPerWeek}
                onChange={(e) => setPreferences({...preferences, hoursPerWeek: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {preferences.hoursPerWeek} hours/week
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏱️ Session Duration
              </label>
              <select
                value={preferences.sessionDuration}
                onChange={(e) => setPreferences({...preferences, sessionDuration: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌅 Preferred Learning Time
              </label>
              <div className="space-y-2">
                {[
                  { value: 'morning', label: '🌅 Morning (6AM - 12PM)', emoji: '☕' },
                  { value: 'afternoon', label: '☀️ Afternoon (12PM - 6PM)', emoji: '🌞' },
                  { value: 'evening', label: '🌆 Evening (6PM - 11PM)', emoji: '🌙' }
                ].map(time => (
                  <label key={time.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.preferredTimes.includes(time.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences({
                            ...preferences,
                            preferredTimes: [...preferences.preferredTimes, time.value]
                          })
                        } else {
                          setPreferences({
                            ...preferences,
                            preferredTimes: preferences.preferredTimes.filter(t => t !== time.value)
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span>{time.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Learning Intensity
              </label>
              <select
                value={preferences.intensity}
                onChange={(e) => setPreferences({...preferences, intensity: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="light">🐌 Light (Theory + Basic Practice)</option>
                <option value="moderate">⚡ Moderate (Balanced Approach)</option>
                <option value="intensive">🚀 Intensive (Project-Based)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Start Date
              </label>
              <input
                type="date"
                value={preferences.startDate}
                onChange={(e) => setPreferences({...preferences, startDate: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏁 Target End Date
              </label>
              <input
                type="date"
                value={preferences.endDate}
                onChange={(e) => setPreferences({...preferences, endDate: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200"
            >
              ← Back to Skills
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Generate My Schedule →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generate Schedule */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-semibold mb-2">Creating Your Personalized Schedule</h2>
            <p className="text-gray-600">
              Our AI is analyzing your skills, goals, and preferences to create the perfect learning plan
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3 text-green-600">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span>Analyzing skill gaps...</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-600">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Optimizing learning path...</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-purple-600">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Scheduling practice sessions...</span>
            </div>
          </div>

          <button
            onClick={generateSchedule}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </div>
            ) : (
              '✨ Generate My Learning Schedule'
            )}
          </button>

          <div className="mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Preferences
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generated Schedule */}
      {currentStep === 4 && schedule && (
        <div className="space-y-8">
          {/* Schedule Overview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🎉</span>
              <h2 className="text-2xl font-bold text-green-800">Your Personalized Learning Schedule is Ready!</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{schedule.totalDuration}</div>
                <div className="text-sm text-gray-600">Total Duration</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{schedule.totalHours}h</div>
                <div className="text-sm text-gray-600">Total Learning Hours</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{selectedSkills.length}</div>
                <div className="text-sm text-gray-600">Skills to Master</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{schedule.milestones.length}</div>
                <div className="text-sm text-gray-600">Milestones</div>
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">📅 Weekly Learning Schedule</h3>
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {schedule.weeklyPlan.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">{day.day}</h4>
                  <div className="space-y-2">
                    {day.sessions.map((session, sessionIndex) => (
                      <div key={sessionIndex} className="bg-blue-50 rounded p-2 text-sm">
                        <div className="font-medium text-blue-900">{session.time}</div>
                        <div className="text-blue-700">{session.skill}</div>
                        <div className="text-blue-600 text-xs">{session.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">🎯 Learning Milestones</h3>
            <div className="space-y-3">
              {schedule.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    W{milestone.week}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{milestone.skill} - {milestone.target}</h4>
                    <p className="text-sm text-gray-600">{milestone.assessment}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg">{milestone.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
              📅 Add to Calendar
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
              📊 Start Tracking Progress
            </button>
            <button 
              onClick={() => setCurrentStep(1)}
              className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200"
            >
              🔄 Create New Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScheduleMaker