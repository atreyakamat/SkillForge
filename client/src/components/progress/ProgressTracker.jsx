import React, { useState, useEffect, useContext } from 'react'
import { Line, Doughnut, Bar, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js'
import { SkillContext } from '../../contexts/SkillContext'
import { useAuthContext } from '../../contexts/AuthContext'
import analyticsAPI from '../../services/analyticsAPI'

// Register Chart.js components - Updated for React 18
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
)

const ProgressTracker = () => {
  const { skills } = useContext(SkillContext)
  const { user } = useAuthContext()
  const [progressData, setProgressData] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  const [achievements, setAchievements] = useState([])
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressData()
  }, [selectedTimeframe])

  const loadProgressData = async () => {
    setLoading(true)
    try {
      // Simulate API call to get progress data
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockProgressData = generateMockProgressData()
      setProgressData(mockProgressData)
      setAchievements(generateAchievements())
      setStreakData({ current: 12, longest: 28 })
    } catch (error) {
      console.error('Failed to load progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockProgressData = () => {
    const timeframes = {
      week: { days: 7, label: 'Days' },
      month: { days: 30, label: 'Days' },
      quarter: { days: 90, label: 'Days' },
      year: { days: 365, label: 'Days' }
    }

    const { days } = timeframes[selectedTimeframe]
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return date.toLocaleDateString()
    })

    const skillLevels = skills.slice(0, 5).reduce((acc, skill) => {
      acc[skill.name] = Array.from({ length: days }, (_, i) => {
        const baseLevel = skill.selfRating || 1
        const progress = (i / days) * 2 // Simulate 2 level improvement over timeframe
        return Math.min(10, baseLevel + progress + Math.random() * 0.5 - 0.25)
      })
      return acc
    }, {})

    const studyHours = Array.from({ length: days }, () => Math.floor(Math.random() * 4) + 1)
    const assessmentScores = Array.from({ length: Math.floor(days / 7) }, () => 
      Math.floor(Math.random() * 30) + 70
    )

    return {
      dates,
      skillLevels,
      studyHours,
      assessmentScores,
      totalHours: studyHours.reduce((sum, hours) => sum + hours, 0),
      averageScore: Math.round(assessmentScores.reduce((sum, score) => sum + score, 0) / assessmentScores.length),
      skillsImproved: Object.keys(skillLevels).length,
      completedSessions: Math.floor(days * 0.8)
    }
  }

  const generateAchievements = () => {
    return [
      {
        id: 1,
        title: 'JavaScript Ninja',
        description: 'Completed 10 JavaScript challenges',
        icon: '🥷',
        date: '2025-09-20',
        rarity: 'rare',
        points: 500
      },
      {
        id: 2,
        title: 'Consistent Learner',
        description: '7-day learning streak',
        icon: '🔥',
        date: '2025-09-25',
        rarity: 'common',
        points: 200
      },
      {
        id: 3,
        title: 'React Master',
        description: 'Built 5 React components',
        icon: '⚛️',
        date: '2025-09-22',
        rarity: 'epic',
        points: 750
      },
      {
        id: 4,
        title: 'Early Bird',
        description: 'Completed morning study session',
        icon: '🌅',
        date: '2025-09-27',
        rarity: 'common',
        points: 100
      },
      {
        id: 5,
        title: 'Problem Solver',
        description: 'Solved 50 coding problems',
        icon: '🧩',
        date: '2025-09-26',
        rarity: 'legendary',
        points: 1000
      }
    ]
  }

  const getProgressLineChart = () => {
    if (!progressData) return null

    const topSkills = Object.keys(progressData.skillLevels).slice(0, 3)
    
    return {
      labels: progressData.dates,
      datasets: topSkills.map((skill, index) => ({
        label: skill,
        data: progressData.skillLevels[skill],
        borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)'][index],
        backgroundColor: ['rgba(59, 130, 246, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'][index],
        tension: 0.4,
        fill: true
      }))
    }
  }

  const getSkillDistribution = () => {
    if (!skills || skills.length === 0) return null

    const skillLevels = {
      'Beginner (1-3)': skills.filter(s => (s.selfRating || 0) <= 3).length,
      'Intermediate (4-6)': skills.filter(s => (s.selfRating || 0) >= 4 && (s.selfRating || 0) <= 6).length,
      'Advanced (7-8)': skills.filter(s => (s.selfRating || 0) >= 7 && (s.selfRating || 0) <= 8).length,
      'Expert (9-10)': skills.filter(s => (s.selfRating || 0) >= 9).length
    }

    return {
      labels: Object.keys(skillLevels),
      datasets: [{
        data: Object.values(skillLevels),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'white'
      }]
    }
  }

  const getStudyHoursChart = () => {
    if (!progressData) return null

    return {
      labels: progressData.dates.filter((_, i) => i % 7 === 0),
      datasets: [{
        label: 'Study Hours',
        data: progressData.studyHours.filter((_, i) => i % 7 === 0),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1
      }]
    }
  }

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
    return colors[rarity] || colors.common
  }

  const ProgressMetric = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Learning Progress Tracker
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">📈 Progress Overview</h2>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ProgressMetric
            title="Total Study Hours"
            value={progressData?.totalHours || 0}
            subtitle={`${selectedTimeframe} period`}
            icon="⏰"
            color="blue"
          />
          <ProgressMetric
            title="Skills Improved"
            value={progressData?.skillsImproved || 0}
            subtitle="Active development"
            icon="📚"
            color="green"
          />
          <ProgressMetric
            title="Average Score"
            value={`${progressData?.averageScore || 0}%`}
            subtitle="Assessment performance"
            icon="🎯"
            color="purple"
          />
          <ProgressMetric
            title="Learning Streak"
            value={`${streakData.current} days`}
            subtitle={`Best: ${streakData.longest} days`}
            icon="🔥"
            color="orange"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Skill Level Progression</h3>
          {progressData && (
            <div style={{ height: '300px' }}>
              <Line 
                data={getProgressLineChart()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Skill Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Skill Level Distribution</h3>
          {skills && (
            <div style={{ height: '300px' }} className="flex items-center justify-center">
              <Doughnut 
                data={getSkillDistribution()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Study Pattern */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">📅 Study Pattern</h3>
        {progressData && (
          <div style={{ height: '300px' }}>
            <Bar 
              data={getStudyHoursChart()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Hours'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">🏆 Recent Achievements</h3>
          <div className="text-sm text-gray-600">
            Total Points: <span className="font-bold text-blue-600">
              {achievements.reduce((sum, achievement) => sum + achievement.points, 0)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border rounded-lg p-4 ${getRarityColor(achievement.rarity)} transition-all hover:scale-105`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-xs opacity-75">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">+{achievement.points}</div>
                  <div className="text-xs opacity-75 capitalize">{achievement.rarity}</div>
                </div>
              </div>
              <div className="text-xs opacity-75">
                Earned: {new Date(achievement.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 This Week's Goals</h3>
        <div className="space-y-4">
          {[
            { goal: 'Complete 5 JavaScript exercises', progress: 80, target: '5/5' },
            { goal: 'Study for 10 hours', progress: 70, target: '7/10 hours' },
            { goal: 'Take 2 assessments', progress: 50, target: '1/2 assessments' },
            { goal: 'Learn one new React concept', progress: 100, target: '1/1 concept' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{item.goal}</span>
                  <span className="text-sm text-gray-600">{item.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.progress === 100 ? 'bg-green-500' : 
                      item.progress >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl">
                {item.progress === 100 ? '✅' : '⏳'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2">
          <span>📊</span>
          <span>View Detailed Analytics</span>
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2">
          <span>🎯</span>
          <span>Set New Goals</span>
        </button>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center space-x-2">
          <span>🏆</span>
          <span>View All Achievements</span>
        </button>
      </div>
    </div>
  )
}

export default ProgressTracker