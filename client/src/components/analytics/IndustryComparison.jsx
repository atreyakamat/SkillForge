import React, { useState, useMemo } from 'react'
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2'

const IndustryComparison = ({ userSkills = [], industryData, gapData }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('Technology')
  const [comparisonType, setComparisonType] = useState('skills') // skills, salary, demand

  // Mock industry data - in a real app, this would come from the API
  const industries = {
    'Technology': {
      averageSkillLevel: 3.8,
      topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker'],
      salaryBenchmarks: { junior: 75000, mid: 120000, senior: 180000 },
      skillDemand: {
        'JavaScript': { demand: 95, growth: 15 },
        'React': { demand: 88, growth: 20 },
        'Python': { demand: 92, growth: 25 },
        'Node.js': { demand: 78, growth: 18 },
        'AWS': { demand: 85, growth: 30 },
        'TypeScript': { demand: 75, growth: 35 }
      }
    },
    'Finance': {
      averageSkillLevel: 3.5,
      topSkills: ['Python', 'SQL', 'Excel', 'R', 'Tableau', 'Bloomberg'],
      salaryBenchmarks: { junior: 85000, mid: 130000, senior: 200000 },
      skillDemand: {
        'Python': { demand: 90, growth: 20 },
        'SQL': { demand: 95, growth: 10 },
        'Excel': { demand: 88, growth: 5 },
        'R': { demand: 65, growth: 15 },
        'Tableau': { demand: 70, growth: 18 }
      }
    },
    'Healthcare': {
      averageSkillLevel: 3.2,
      topSkills: ['Python', 'R', 'SQL', 'HIPAA', 'EHR', 'Data Analysis'],
      salaryBenchmarks: { junior: 70000, mid: 110000, senior: 160000 },
      skillDemand: {
        'Python': { demand: 75, growth: 25 },
        'R': { demand: 80, growth: 20 },
        'SQL': { demand: 85, growth: 12 },
        'HIPAA': { demand: 60, growth: 8 }
      }
    }
  }

  const currentIndustryData = industries[selectedIndustry] || industries['Technology']

  // Process user skills for comparison
  const userSkillMap = useMemo(() => {
    const skillMap = new Map()
    userSkills.forEach(skill => {
      skillMap.set(skill.name, skill.currentLevel || 0)
    })
    return skillMap
  }, [userSkills])

  // Generate skill comparison chart data
  const skillComparisonData = useMemo(() => {
    const topSkills = currentIndustryData.topSkills.slice(0, 8)
    
    return {
      labels: topSkills,
      datasets: [
        {
          label: 'Your Level',
          data: topSkills.map(skill => userSkillMap.get(skill) || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        {
          label: 'Industry Average',
          data: topSkills.map(() => currentIndustryData.averageSkillLevel),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        }
      ]
    }
  }, [currentIndustryData, userSkillMap])

  // Generate skill demand chart data
  const skillDemandData = useMemo(() => {
    const skills = Object.keys(currentIndustryData.skillDemand)
    
    return {
      labels: skills,
      datasets: [
        {
          label: 'Market Demand',
          data: skills.map(skill => currentIndustryData.skillDemand[skill].demand),
          backgroundColor: skills.map(skill => {
            const demand = currentIndustryData.skillDemand[skill].demand
            return demand >= 85 ? 'rgba(34, 197, 94, 0.8)' : 
                   demand >= 70 ? 'rgba(59, 130, 246, 0.8)' : 
                   'rgba(245, 158, 11, 0.8)'
          }),
          borderWidth: 1
        }
      ]
    }
  }, [currentIndustryData])

  // Generate salary comparison chart
  const salaryComparisonData = {
    labels: ['Junior', 'Mid-Level', 'Senior'],
    datasets: [
      {
        label: 'Industry Average',
        data: [
          currentIndustryData.salaryBenchmarks.junior,
          currentIndustryData.salaryBenchmarks.mid,
          currentIndustryData.salaryBenchmarks.senior
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Your Potential',
        data: [
          industryData?.salaryBenchmarks?.current || 85000,
          industryData?.salaryBenchmarks?.potential || 110000,
          (industryData?.salaryBenchmarks?.potential || 110000) * 1.4
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: comparisonType === 'skills' ? 5 : undefined,
        ticks: {
          stepSize: comparisonType === 'skills' ? 1 : undefined
        }
      }
    }
  }

  const getSkillGap = (skill) => {
    const userLevel = userSkillMap.get(skill) || 0
    const industryLevel = currentIndustryData.averageSkillLevel
    return Math.max(0, industryLevel - userLevel)
  }

  const getMarketPosition = () => {
    const userAverage = Array.from(userSkillMap.values()).reduce((sum, level) => sum + level, 0) / userSkillMap.size || 0
    const industryAverage = currentIndustryData.averageSkillLevel
    
    if (userAverage >= industryAverage * 1.2) return { label: 'Above Average', color: 'text-green-600', icon: '📈' }
    if (userAverage >= industryAverage * 0.8) return { label: 'Average', color: 'text-blue-600', icon: '📊' }
    return { label: 'Below Average', color: 'text-red-600', icon: '📉' }
  }

  const marketPosition = getMarketPosition()

  return (
    <div className="space-y-6">
      {/* Industry Selector and Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Industry Comparison</h3>
            <p className="text-gray-600 mt-1">
              Compare your skills against industry standards and market trends
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(industries).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="skills">Skill Levels</option>
              <option value="demand">Market Demand</option>
              <option value="salary">Salary Ranges</option>
            </select>
          </div>
        </div>

        {/* Market Position Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{marketPosition.icon}</div>
            <div className={`font-semibold ${marketPosition.color}`}>{marketPosition.label}</div>
            <div className="text-sm text-gray-600">Market Position</div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentIndustryData.topSkills.filter(skill => userSkillMap.has(skill)).length}
            </div>
            <div className="text-sm text-green-700">Top Skills Matched</div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {currentIndustryData.topSkills.filter(skill => getSkillGap(skill) > 0).length}
            </div>
            <div className="text-sm text-yellow-700">Skills to Improve</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${((currentIndustryData.salaryBenchmarks.mid - (industryData?.salaryBenchmarks?.current || 85000)) / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-purple-700">Potential Increase</div>
          </div>
        </div>
      </div>

      {/* Main Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">
            {comparisonType === 'skills' ? 'Skill Level Comparison' : 
             comparisonType === 'demand' ? 'Market Demand Analysis' : 
             'Salary Benchmark Comparison'}
          </h4>
        </div>
        
        <div style={{ height: '400px' }}>
          {comparisonType === 'skills' && (
            <Bar data={skillComparisonData} options={chartOptions} />
          )}
          {comparisonType === 'demand' && (
            <Bar data={skillDemandData} options={chartOptions} />
          )}
          {comparisonType === 'salary' && (
            <Line data={salaryComparisonData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills in Industry */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Top Skills in {selectedIndustry}
          </h4>
          
          <div className="space-y-4">
            {currentIndustryData.topSkills.map((skill, index) => {
              const userLevel = userSkillMap.get(skill) || 0
              const gap = getSkillGap(skill)
              const demand = currentIndustryData.skillDemand[skill]
              
              return (
                <div key={skill} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{skill}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        gap === 0 ? 'bg-green-100 text-green-800' :
                        gap <= 1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {gap === 0 ? 'On Track' : `Gap: ${gap.toFixed(1)}`}
                      </span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  </div>
                  
                  {/* Skill Level Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Your Level: {userLevel}/5</span>
                      <span>Industry Avg: {currentIndustryData.averageSkillLevel}/5</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(userLevel / 5) * 100}%` }}
                        />
                      </div>
                      <div 
                        className="absolute top-0 h-2 w-0.5 bg-green-500"
                        style={{ left: `${(currentIndustryData.averageSkillLevel / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Market Demand Info */}
                  {demand && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Demand:</span>
                        <span className="font-medium">{demand.demand}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Growth:</span>
                        <span className="font-medium text-green-600">+{demand.growth}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Career Insights */}
        <div className="space-y-6">
          {/* Salary Progression */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Salary Progression</h4>
            
            <div className="space-y-4">
              {['junior', 'mid', 'senior'].map((level, index) => {
                const salary = currentIndustryData.salaryBenchmarks[level]
                const yourPotential = level === 'junior' ? (industryData?.salaryBenchmarks?.current || 85000) :
                                   level === 'mid' ? (industryData?.salaryBenchmarks?.potential || 110000) :
                                   (industryData?.salaryBenchmarks?.potential || 110000) * 1.4
                
                return (
                  <div key={level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{level} Level</div>
                      <div className="text-sm text-gray-600">Industry Average</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${salary.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">
                        Your potential: ${Math.round(yourPotential).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <div className="font-medium text-green-900">High Growth Skills</div>
                    <div className="text-sm text-green-700">
                      {Object.entries(currentIndustryData.skillDemand)
                        .filter(([, data]) => data.growth >= 20)
                        .map(([skill]) => skill)
                        .slice(0, 3)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-medium text-blue-900">High Demand Skills</div>
                    <div className="text-sm text-blue-700">
                      {Object.entries(currentIndustryData.skillDemand)
                        .filter(([, data]) => data.demand >= 85)
                        .map(([skill]) => skill)
                        .slice(0, 3)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Industry-Specific Recommendations</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Priority Skills to Learn</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              {currentIndustryData.topSkills
                .filter(skill => getSkillGap(skill) > 1)
                .slice(0, 3)
                .map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))
              }
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">Growth Opportunities</h5>
            <ul className="text-sm text-green-800 space-y-1">
              {Object.entries(currentIndustryData.skillDemand)
                .sort(([,a], [,b]) => b.growth - a.growth)
                .slice(0, 3)
                .map(([skill], index) => (
                  <li key={index}>• {skill}</li>
                ))
              }
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h5 className="font-medium text-purple-900 mb-2">Career Advancement</h5>
            <div className="text-sm text-purple-800 space-y-1">
              <div>• Focus on top 3 industry skills</div>
              <div>• Potential salary increase: ${Math.round((currentIndustryData.salaryBenchmarks.mid - (industryData?.salaryBenchmarks?.current || 85000))/1000)}k</div>
              <div>• Timeline: 6-12 months</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndustryComparison


