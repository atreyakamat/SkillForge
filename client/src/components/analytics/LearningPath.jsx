import React, { useState } from 'react'

const LearningPath = ({ learningPath, gapData }) => {
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [completedItems, setCompletedItems] = useState(new Set())

  const toggleCompletion = (itemId) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
  }

  const calculateProgress = (phase) => {
    if (!phase.resources) return 0
    const totalItems = phase.resources.length
    const completedInPhase = phase.resources.filter(resource => 
      completedItems.has(`${phase.phase}-${resource.title}`)
    ).length
    return totalItems > 0 ? Math.round((completedInPhase / totalItems) * 100) : 0
  }

  const getTimelineColor = (index, totalPhases) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500']
    return colors[index % colors.length]
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course':
        return '🎓'
      case 'tutorial':
        return '📖'
      case 'project':
        return '💻'
      case 'certification':
        return '🏆'
      case 'book':
        return '📚'
      default:
        return '📄'
    }
  }

  if (!learningPath) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🛤️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Path Available</h3>
        <p className="text-gray-600">
          Complete your skill assessment to get personalized learning recommendations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Learning Path Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Personalized Learning Path</h3>
            <p className="text-gray-600 mt-1">
              Structured roadmap to close your skill gaps and achieve your career goals
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {learningPath.totalEstimatedTime}
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>

        {/* Career Impact Summary */}
        {learningPath.careerImpact && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                +${learningPath.careerImpact.salaryIncrease?.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Potential Salary Increase</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {learningPath.careerImpact.jobOpportunities}
              </div>
              <div className="text-sm text-blue-700">New Job Opportunities</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 capitalize">
                {learningPath.careerImpact.industryDemand}
              </div>
              <div className="text-sm text-purple-700">Market Demand</div>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">
              {learningPath.phases?.reduce((acc, phase) => acc + calculateProgress(phase), 0) / (learningPath.phases?.length || 1)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${learningPath.phases?.reduce((acc, phase) => acc + calculateProgress(phase), 0) / (learningPath.phases?.length || 1)}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Learning Phases */}
      {learningPath.phases && learningPath.phases.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Learning Phases</h4>
          
          {learningPath.phases.map((phase, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Phase Header */}
              <div 
                className={`${getTimelineColor(index, learningPath.phases.length)} p-6 text-white cursor-pointer`}
                onClick={() => setSelectedPhase(selectedPhase === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xl font-semibold">Phase {index + 1}: {phase.phase}</h5>
                    <p className="text-blue-100 mt-1">{phase.duration}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm opacity-90">Progress</div>
                      <div className="font-semibold">{calculateProgress(phase)}%</div>
                    </div>
                    <button className="text-white hover:text-blue-100">
                      {selectedPhase === index ? '▼' : '▶'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phase Content */}
              {selectedPhase === index && (
                <div className="p-6">
                  {/* Skills in this phase */}
                  {phase.skills && phase.skills.length > 0 && (
                    <div className="mb-6">
                      <h6 className="font-medium text-gray-900 mb-3">Skills You'll Learn</h6>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Resources */}
                  {phase.resources && phase.resources.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-4">Learning Resources</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.resources.map((resource, resourceIndex) => {
                          const resourceId = `${phase.phase}-${resource.title}`
                          const isCompleted = completedItems.has(resourceId)
                          
                          return (
                            <div 
                              key={resourceIndex} 
                              className={`border rounded-lg p-4 transition-all ${
                                isCompleted 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start space-x-3">
                                  <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                                  <div>
                                    <h6 className="font-medium text-gray-900">{resource.title}</h6>
                                    <p className="text-sm text-gray-600">{resource.provider}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleCompletion(resourceId)}
                                  className={`p-1 rounded-full transition-colors ${
                                    isCompleted 
                                      ? 'text-green-600 hover:text-green-700' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                >
                                  {isCompleted ? '✅' : '⭕'}
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <span className="text-gray-600">⏱️ {resource.duration}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>
                                    {resource.difficulty}
                                  </span>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 font-medium">
                                  Start
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Milestones Timeline */}
      {learningPath.milestones && learningPath.milestones.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Learning Milestones</h4>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {learningPath.milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-center space-x-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{milestone.week}</span>
                  </div>
                  
                  {/* Milestone content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h6 className="font-medium text-gray-900">{milestone.achievement}</h6>
                      <span className="text-sm text-gray-500">Week {milestone.week}</span>
                    </div>
                    {milestone.skills && milestone.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {milestone.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left transition-colors">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-medium text-gray-900">Create Study Schedule</div>
            <div className="text-sm text-gray-600">Set up a personalized study plan</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 text-left transition-colors">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-gray-900">Track Progress</div>
            <div className="text-sm text-gray-600">Monitor your learning journey</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 text-left transition-colors">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-medium text-gray-900">Get Recommendations</div>
            <div className="text-sm text-gray-600">Discover additional resources</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LearningPath