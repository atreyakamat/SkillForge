import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout.jsx'
import QuickStats from '../components/dashboard/QuickStats.jsx'
import QuickActions from '../components/dashboard/QuickActions.jsx'
import SkillOverview from '../components/dashboard/SkillOverview.jsx'
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx'
import JobMatches from '../components/analytics/JobMatches.jsx'
import SearchHeader from '../components/dashboard/SearchHeader.jsx'
import KpiRing from '../components/dashboard/KpiRing.jsx'
import SkillTable from '../components/dashboard/SkillTable.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext.jsx'
import skillsAPI from '../services/skillsAPI.js'
import analyticsAPI from '../services/analyticsAPI.js'

export default function Dashboard() {
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [jobMatches, setJobMatches] = useState([])
  const [developmentPlan, setDevelopmentPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
  }, [isAuthenticated, navigate])

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        
        // Fetch user skills
        const skillsResponse = await skillsAPI.getUserSkills()
        if (skillsResponse.success) {
          const userSkills = skillsResponse.skills || []
          // Transform skills for dashboard display
          const transformedSkills = userSkills.map(skill => ({
            id: skill._id || skill.id,
            name: skill.name || skill.skillName,
            category: skill.category || 'General',
            self: skill.selfRating || 0,
            peer: skill.peerRating || 0
          }))
          setSkills(transformedSkills)
        }
        
        // Fetch job matches
        const jobMatchesResponse = await analyticsAPI.getJobMatches()
        if (jobMatchesResponse.success) {
          setJobMatches(jobMatchesResponse.matches || [])
        }
        
        // Fetch development plan
        const planResponse = await analyticsAPI.getDevelopmentPlan()
        if (planResponse.success) {
          setDevelopmentPlan(planResponse.plan)
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        
        // If authentication error, redirect to login
        if (error.status === 401 || error.message.includes('Authorization')) {
          navigate('/login')
          return
        }
        
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated, navigate])

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Fallback sample skills if no real skills available
  const displaySkills = skills.length ? skills : [
    { id: '1', name: 'JavaScript', category: 'Frontend', self: 4.5, peer: 4 },
    { id: '2', name: 'React', category: 'Frontend', self: 4, peer: 3.5 },
    { id: '3', name: 'Node.js', category: 'Backend', self: 3, peer: 2.5 },
    { id: '4', name: 'UX Design', category: 'Design', self: 2, peer: 1.5 },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <SearchHeader />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SearchHeader />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Calculate real statistics
  const calculateStats = () => {
    const totalSkills = skills.length
    const totalReviews = skills.reduce((sum, skill) => sum + (skill.peer > 0 ? 1 : 0), 0)
    
    // Calculate gap score (percentage of skills at satisfactory level)
    const satisfactorySkills = skills.filter(skill => skill.self >= 7 || skill.peer >= 7).length
    const gapScore = totalSkills > 0 ? Math.round((satisfactorySkills / totalSkills) * 100) : 0
    
    // Calculate learning hours based on gaps and development plan
    const learningHours = developmentPlan?.estimatedHours || 
      skills.reduce((sum, skill) => {
        const gap = Math.max(0, 7 - Math.max(skill.self, skill.peer))
        return sum + (gap * 4) // Estimate 4 hours per skill level gap
      }, 0)
    
    return {
      skills: totalSkills,
      reviews: totalReviews,
      gapScore,
      learningHours
    }
  }

  return (
      <div className="space-y-6 magical-fade-in">
          <div className="magical-slide-up">
            <SearchHeader />
          </div>
          <div className="magical-slide-up">
            <QuickStats totals={calculateStats()} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/skills" className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700">Manage Skills</Link>
            <Link to="/assessment" className="bg-secondary-600 text-white rounded-lg px-4 py-2 hover:bg-secondary-700">Assess Skills</Link>
            <button className="bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700">Request Peer Review</button>
          </div>
          {/* New User Welcome Message */}
          {skills.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to SkillForge! 🎉</h3>
              <p className="text-blue-800 mb-4">
                Get started by adding your skills to unlock personalized job matches and development recommendations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/skills" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Add Your Skills
                </Link>
                <Link to="/assessment" className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
                  Take Assessment
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Total Skills</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{skills.length}</p>
              {skills.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">Add your first skill!</p>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Job Matches</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{jobMatches.length}</p>
            </div>
            <KpiRing percent={85} label="Skill Match Score" />
            <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Learning Progress</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: developmentPlan?.progress ? `${developmentPlan.progress}%` : '60%' }}></div>
              </div>
              <p className="text-right text-gray-500 dark:text-gray-400 mt-2">{developmentPlan?.progress || 60}%</p>
            </div>
          </div>
          <div className="magical-slide-up">
            <QuickActions />
          </div>
          <div className="magical-slide-up">
            <SkillOverview skills={displaySkills} />
          </div>
          <div className="magical-slide-up">
            <ActivityFeed />
          </div>
          <div className="magical-slide-up">
            <SkillTable />
          </div>
          <div className="magical-slide-up">
            <JobMatches matches={jobMatches} />
          </div>
      </div>
  )
}

