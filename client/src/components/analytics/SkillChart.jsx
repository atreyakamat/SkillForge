import React, { useState, useRef, useMemo } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import { Radar, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
)

const SkillChart = ({ userSkills, gapData, selectedJob }) => {
  const [chartType, setChartType] = useState('radar')
  const [viewMode, setViewMode] = useState('comparison') // comparison, gaps, progress
  const radarRef = useRef(null)
  const barRef = useRef(null)

  // Process skill data for visualization
  const processedData = useMemo(() => {
    if (!userSkills || userSkills.length === 0) {
      return {
        labels: [],
        userLevels: [],
        requiredLevels: [],
        gaps: [],
        colors: []
      }
    }

    const skillMap = new Map()
    
    // Process user skills
    userSkills.forEach(skill => {
      skillMap.set(skill.name, {
        name: skill.name,
        userLevel: skill.currentLevel || 0,
        requiredLevel: 0,
        gap: 0,
        category: skill.category || 'technical'
      })
    })

    // Add gap data if available
    if (gapData?.skillGaps) {
      gapData.skillGaps.forEach(gap => {
        const existing = skillMap.get(gap.skill) || {
          name: gap.skill,
          userLevel: gap.currentLevel || 0,
          requiredLevel: 0,
          gap: 0,
          category: 'technical'
        }
        
        existing.requiredLevel = gap.requiredLevel || 0
        existing.gap = gap.gap || 0
        existing.priority = gap.priority
        skillMap.set(gap.skill, existing)
      })
    }

    // Add job-specific requirements
    if (selectedJob?.job?.skills?.required) {
      selectedJob.job.skills.required.forEach(skill => {
        const existing = skillMap.get(skill.name) || {
          name: skill.name,
          userLevel: 0,
          requiredLevel: 0,
          gap: 0,
          category: skill.category || 'technical'
        }
        
        existing.requiredLevel = skill.level
        existing.gap = Math.max(0, skill.level - existing.userLevel)
        skillMap.set(skill.name, existing)
      })
    }

    const skills = Array.from(skillMap.values()).slice(0, 12) // Limit to 12 skills for readability

    return {
      labels: skills.map(s => s.name),
      userLevels: skills.map(s => s.userLevel),
      requiredLevels: skills.map(s => s.requiredLevel),
      gaps: skills.map(s => s.gap),
      priorities: skills.map(s => s.priority),
      categories: skills.map(s => s.category),
      colors: skills.map(s => {
        if (s.gap === 0) return '#10B981' // Green for no gap
        if (s.gap <= 1) return '#F59E0B' // Amber for small gap  
        return '#EF4444' // Red for large gap
      })
    }
  }, [userSkills, gapData, selectedJob])

  // Chart configurations
  const radarData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'Your Skills',
        data: processedData.userLevels,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      },
      ...(processedData.requiredLevels.some(level => level > 0) ? [{
        label: selectedJob ? 'Job Requirements' : 'Target Level',
        data: processedData.requiredLevels,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)'
      }] : [])
    ]
  }

  const barData = {
    labels: processedData.labels,
    datasets: viewMode === 'gaps' ? [
      {
        label: 'Skill Gap',
        data: processedData.gaps,
        backgroundColor: processedData.colors,
        borderColor: processedData.colors.map(color => color.replace('0.2', '1')),
        borderWidth: 1
      }
    ] : [
      {
        label: 'Your Level',
        data: processedData.userLevels,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      ...(processedData.requiredLevels.some(level => level > 0) ? [{
        label: 'Required Level',
        data: processedData.requiredLevels,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }] : [])
    ]
  }

  const heatmapData = {
    labels: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'],
    datasets: [
      {
        label: 'Skill Distribution',
        data: [1, 2, 3, 4, 5].map(level => 
          processedData.userLevels.filter(userLevel => Math.floor(userLevel) === level).length
        ),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(245, 158, 11, 0.8)',  // Amber
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(139, 92, 246, 0.8)'   // Purple
        ]
      }
    ]
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const skillName = context.label
            const value = context.parsed.y || context.parsed.r || context.parsed
            const gap = processedData.gaps[context.dataIndex] || 0
            
            if (viewMode === 'gaps') {
              return `${skillName}: Gap of ${gap} levels`
            }
            return `${context.dataset.label}: ${value}/5`
          }
        }
      }
    }
  }

  const radarOptions = {
    ...commonOptions,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const exportChart = () => {
    const chart = chartType === 'radar' ? radarRef.current : barRef.current
    if (!chart) return
    
    const url = chart.toBase64Image()
    const link = document.createElement('a')
    link.href = url
    link.download = `skill-chart-${chartType}-${Date.now()}.png`
    link.click()
  }

  // Heat map component
  const HeatMapGrid = () => {
    const gridSize = 10
    const skills = processedData.labels
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Skill Gap Heat Map</h4>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: gridSize * Math.ceil(skills.length / gridSize) }).map((_, index) => {
            const skillIndex = index % skills.length
            const gap = processedData.gaps[skillIndex] || 0
            const intensity = Math.min(gap / 3, 1) // Normalize to 0-1
            
            return (
              <div
                key={index}
                className={`w-6 h-6 rounded-sm cursor-pointer transition-all hover:scale-110`}
                style={{
                  backgroundColor: `rgba(239, 68, 68, ${intensity})`,
                  border: intensity > 0 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #e5e7eb'
                }}
                title={skills[skillIndex] ? `${skills[skillIndex]}: Gap ${gap}` : ''}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>No Gap</span>
          <span>Critical Gap</span>
        </div>
      </div>
    )
  }

  if (!processedData.labels.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-gray-500 mb-4">No skill data available</div>
        <p className="text-sm text-gray-400">
          Add some skills to your profile to see detailed analytics
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="radar">Radar Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="heatmap">Heat Map</option>
                <option value="distribution">Distribution</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="comparison">Comparison</option>
                <option value="gaps">Gaps Only</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>

          <button
            onClick={exportChart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Export Chart
          </button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4">
          {selectedJob ? `Skills Analysis: ${selectedJob.job.title}` : 'Skill Analysis'}
        </h3>
        
        {chartType === 'radar' && (
          <div style={{ height: '400px' }}>
            <Radar ref={radarRef} data={radarData} options={radarOptions} />
          </div>
        )}
        
        {chartType === 'bar' && (
          <div style={{ height: '400px' }}>
            <Bar ref={barRef} data={barData} options={barOptions} />
          </div>
        )}
        
        {chartType === 'heatmap' && <HeatMapGrid />}
        
        {chartType === 'distribution' && (
          <div style={{ height: '400px' }}>
            <Doughnut data={heatmapData} options={commonOptions} />
          </div>
        )}
      </div>

      {/* Skill Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gaps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Critical Skill Gaps</h4>
          <div className="space-y-3">
            {processedData.labels
              .map((label, index) => ({
                skill: label,
                gap: processedData.gaps[index],
                priority: processedData.priorities[index]
              }))
              .sort((a, b) => b.gap - a.gap)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.skill}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs ${
                      item.gap === 0 ? 'bg-green-100 text-green-800' :
                      item.gap <= 1 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Gap: {item.gap}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Strengths</h4>
          <div className="space-y-3">
            {processedData.labels
              .map((label, index) => ({
                skill: label,
                level: processedData.userLevels[index],
                gap: processedData.gaps[index]
              }))
              .sort((a, b) => b.level - a.level)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.skill}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(item.level / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{item.level}/5</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillChart


