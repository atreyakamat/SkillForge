import React, { useState, useEffect } from 'react'
import { TrendingUp, Clock, Target, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MiniSkillCards = () => {
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading recent activity data
    const loadRecentActivity = () => {
      setLoading(true)
      
      // Mock recent activity data (yesterday's activities)
      const mockActivity = [
        {
          id: 1,
          skillName: 'React',
          category: 'Frontend',
          timeSpent: 45,
          progressGained: 2,
          currentLevel: 7,
          color: 'blue',
          lastActivity: 'Completed useEffect tutorial',
          trend: 'up'
        },
        {
          id: 2,
          skillName: 'Node.js',
          category: 'Backend',
          timeSpent: 30,
          progressGained: 1,
          currentLevel: 5,
          color: 'green',
          lastActivity: 'Built REST API',
          trend: 'up'
        },
        {
          id: 3,
          skillName: 'MongoDB',
          category: 'Database',
          timeSpent: 20,
          progressGained: 1,
          currentLevel: 4,
          color: 'emerald',
          lastActivity: 'Schema design practice',
          trend: 'stable'
        },
        {
          id: 4,
          skillName: 'CSS',
          category: 'Frontend',
          timeSpent: 15,
          progressGained: 0,
          currentLevel: 8,
          color: 'purple',
          lastActivity: 'Flexbox exercises',
          trend: 'stable'
        }
      ]

      setTimeout(() => {
        setRecentActivity(mockActivity)
        setLoading(false)
      }, 800)
    }

    loadRecentActivity()
  }, [])

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        accent: 'text-blue-600',
        progress: 'bg-blue-500'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200', 
        text: 'text-green-900',
        accent: 'text-green-600',
        progress: 'bg-green-500'
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-900', 
        accent: 'text-emerald-600',
        progress: 'bg-emerald-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        accent: 'text-purple-600',
        progress: 'bg-purple-500'
      }
    }
    return colorMap[color] || colorMap.blue
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
      default:
        return <Target className="w-3 h-3 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">Yesterday's Activity</h3>
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {recentActivity.reduce((sum, skill) => sum + skill.timeSpent, 0)} min total
        </div>
      </div>
      
      <div className="space-y-2">
        {recentActivity.slice(0, 3).map((skill) => {
          const colors = getColorClasses(skill.color)
          
          return (
            <div
              key={skill.id}
              onClick={() => navigate('/progress')}
              className={`${colors.bg} ${colors.border} border rounded-lg p-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer magical-card group`}
            >
              {/* Skill Name and Level */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${colors.text}`}>
                    {skill.skillName}
                  </span>
                  {getTrendIcon(skill.trend)}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className={`w-3 h-3 ${colors.accent} fill-current`} />
                  <span className={`text-xs font-bold ${colors.accent}`}>
                    {skill.currentLevel}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{skill.category}</span>
                  <span className={colors.accent}>+{skill.progressGained} pts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`${colors.progress} h-1.5 rounded-full transition-all duration-300 group-hover:brightness-110`}
                    style={{ width: `${skill.currentLevel * 10}%` }}
                  ></div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="text-xs text-gray-500 truncate">
                {skill.lastActivity}
              </div>

              {/* Time Spent */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-gray-500">Time spent</span>
                <span className={`font-medium ${colors.accent}`}>
                  {skill.timeSpent} min
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-3 p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-600">Yesterday</div>
            <div className="text-sm font-medium text-gray-800">
              {recentActivity.length} skills
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-600">Points</div>
            <div className="text-sm font-bold text-blue-600">
              +{recentActivity.reduce((sum, skill) => sum + skill.progressGained, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button 
        onClick={() => navigate('/progress')}
        className="w-full mt-3 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center space-x-2 group"
      >
        <TrendingUp className="w-3 h-3 text-blue-500 group-hover:scale-110 transition-transform" />
        <span className="text-gray-700 font-medium">View All Progress</span>
      </button>
    </div>
  )
}

export default MiniSkillCards