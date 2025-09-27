import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const QuickActions = () => {
  const [hoveredAction, setHoveredAction] = useState(null)

  const actions = [
    {
      id: 'schedule',
      title: 'Create Study Schedule',
      description: 'Set up a personalized study plan',
      icon: '📅',
      color: 'blue',
      path: '/schedule',
      features: ['AI-powered planning', 'Custom time slots', 'Skill prioritization'],
      stats: '10 min setup'
    },
    {
      id: 'progress',
      title: 'Track Progress',
      description: 'Monitor your learning journey',
      icon: '📊',
      color: 'green',
      path: '/progress',
      features: ['Visual analytics', 'Achievement badges', 'Streak tracking'],
      stats: 'Real-time updates'
    },
    {
      id: 'recommendations',
      title: 'Get Recommendations',
      description: 'Discover additional resources',
      icon: '💡',
      color: 'purple',
      path: '/recommendations',
      features: ['Personalized content', 'Smart matching', 'Curated resources'],
      stats: '500+ resources'
    }
  ]

  const getColorClasses = (color, variant = 'primary') => {
    const colorMap = {
      blue: {
        primary: 'bg-blue-50 border-blue-200 text-blue-900',
        hover: 'hover:bg-blue-100 hover:border-blue-300',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      green: {
        primary: 'bg-green-50 border-green-200 text-green-900',
        hover: 'hover:bg-green-100 hover:border-green-300',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700 text-white'
      },
      purple: {
        primary: 'bg-purple-50 border-purple-200 text-purple-900',
        hover: 'hover:bg-purple-100 hover:border-purple-300',
        icon: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      }
    }
    return colorMap[color]?.[variant] || colorMap.blue[variant]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="text-sm text-gray-500">Choose your next step</div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.path}
            className="block group"
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <div className={`
              relative border-2 rounded-xl p-6 transition-all duration-300 transform magical-card interactive-glow
              ${getColorClasses(action.color, 'primary')}
              ${getColorClasses(action.color, 'hover')}
              ${hoveredAction === action.id ? 'scale-105 shadow-lg magical-glow' : 'shadow-sm hover:shadow-md'}
            `}>
              
              {/* Floating Icon */}
              <div className="relative mb-4">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-3xl
                  bg-white shadow-md transition-all duration-300 magical-float
                  ${hoveredAction === action.id ? 'scale-110 rotate-12 magical-wiggle' : ''}
                `}>
                  {action.icon}
                </div>
                
                {/* Floating stats badge */}
                <div className={`
                  absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium
                  bg-white shadow-sm border transition-all duration-300
                  ${hoveredAction === action.id ? 'scale-105' : ''}
                  ${getColorClasses(action.color, 'icon')}
                `}>
                  {action.stats}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-75">{action.description}</p>
                </div>

                {/* Features - Show on hover */}
                <div className={`
                  space-y-1 transition-all duration-300 overflow-hidden
                  ${hoveredAction === action.id ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  {action.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <span className="text-green-500">✓</span>
                      <span className="opacity-75">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className={`
                  transition-all duration-300
                  ${hoveredAction === action.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-75'}
                `}>
                  <button className={`
                    w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200
                    ${getColorClasses(action.color, 'button')}
                    group-hover:shadow-md
                  `}>
                    Get Started
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10 overflow-hidden rounded-tr-xl">
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-current opacity-20"></div>
                <div className="absolute top-6 right-6 w-4 h-4 rounded-full bg-current opacity-30"></div>
                <div className="absolute top-4 right-10 w-2 h-2 rounded-full bg-current opacity-40"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Quick Links */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">More Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎯', label: 'Take Assessment', path: '/assessment' },
            { icon: '👥', label: 'Peer Reviews', path: '/peer/dashboard' },
            { icon: '📈', label: 'Analytics', path: '/gap-jobs' },
            { icon: '🛠️', label: 'Skills', path: '/skills' }
          ].map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-medium text-yellow-900">Pro Tip</h4>
            <p className="text-sm text-yellow-800">
              Start with creating a study schedule to maximize your learning efficiency. 
              Our AI will analyze your skill gaps and create the perfect plan for you!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickActions