import React from 'react'

const MetricCard = ({ title, value, subtitle, color = 'blue', trend, icon }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          accent: 'text-green-600'
        }
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          accent: 'text-red-600'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          accent: 'text-yellow-600'
        }
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          accent: 'text-purple-600'
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          accent: 'text-blue-600'
        }
    }
  }

  const colors = getColorClasses(color)
  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↗️'
    if (trend === 'down') return '↘️'
    return null
  }

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${colors.text}`}>{title}</h3>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      
      <div className="flex items-center space-x-2 mb-1">
        <div className={`text-3xl font-bold ${colors.accent}`}>{value}</div>
        {trend && (
          <span className="text-lg">{getTrendIcon(trend)}</span>
        )}
      </div>
      
      {subtitle && (
        <p className={`text-sm ${colors.text} opacity-75`}>{subtitle}</p>
      )}
    </div>
  )
}

export default MetricCard