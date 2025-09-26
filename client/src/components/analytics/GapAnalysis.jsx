import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import { useSkillContext } from '../../contexts/SkillContext'
import { analyticsAPI } from '../../services/api'
import jobsAPI from '../../services/jobsAPI'
import SkillChart from './SkillChart'
import JobMatches from './JobMatches'
import LearningPath from './LearningPath'
import IndustryComparison from './IndustryComparison'
import ExportPanel from './ExportPanel'
import MetricCard from './MetricCard'
import FilterPanel from './FilterPanel'

const GapAnalysis = () => {
  const { user } = useAuthContext()
  const { skills: userSkills } = useSkillContext()
  
  // State management
  const [activeTab, setActiveTab] = useState('overview')
  const [gapData, setGapData] = useState(null)
  const [jobMatches, setJobMatches] = useState([])
  const [learningPath, setLearningPath] = useState(null)
  const [industryData, setIndustryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter state
  const [filters, setFilters] = useState({
    experienceLevel: '',
    location: '',
    remote: null,
    targetRole: '',
    timeframe: '6'
  })
  
  // Selected job for detailed analysis
  const [selectedJob, setSelectedJob] = useState(null)

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      loadGapAnalysisData()
    }
  }, [user?.id, filters])

  const loadGapAnalysisData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load gap analysis
      const gapResponse = await analyticsAPI.getGapAnalysis(user.id, {
        targetRole: filters.targetRole
      })
      setGapData(gapResponse.data)
      
      // Load job matches
      const matchesResponse = await jobsAPI.getJobMatches(user.id, {
        limit: 20,
        experienceLevel: filters.experienceLevel,
        location: filters.location,
        remote: filters.remote
      })
      setJobMatches(matchesResponse.data.matches)
      
      // Load learning path
      const pathResponse = await analyticsAPI.getLearningPath(user.id, {
        timeframe: filters.timeframe
      })
      setLearningPath(pathResponse.data)
      
      // Load industry comparison (mock data for now)
      setIndustryData({
        averageSkillLevel: 3.2,
        topSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        salaryBenchmarks: {
          current: 85000,
          potential: 110000,
          industry_average: 95000
        }
      })
      
    } catch (err) {
      console.error('Failed to load gap analysis data:', err)
      setError('Failed to load analysis data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJobSelect = async (job) => {
    try {
      setSelectedJob(job)
      
      // Load detailed gap analysis for this specific job
      const jobGapResponse = await analyticsAPI.getGapAnalysis(user.id, {
        jobId: job.job.id
      })
      setGapData(jobGapResponse.data)
      
      // Switch to overview tab to show job-specific analysis
      setActiveTab('overview')
      
    } catch (err) {
      console.error('Failed to load job-specific analysis:', err)
    }
  }

  const calculateOverallScore = () => {
    if (!gapData) return 0
    return Math.round(gapData.overallGapScore || 0)
  }

  const getSkillGapSummary = () => {
    if (!gapData) return { critical: 0, moderate: 0, minor: 0 }
    
    const gaps = gapData.skillGaps || []
    return {
      critical: gaps.filter(gap => gap.priority === 'high').length,
      moderate: gaps.filter(gap => gap.priority === 'medium').length,
      minor: gaps.filter(gap => gap.priority === 'low').length
    }
  }

  const getJobMatchSummary = () => {
    if (!jobMatches) return { excellent: 0, good: 0, fair: 0 }
    
    return {
      excellent: jobMatches.filter(match => match.matchScore >= 85).length,
      good: jobMatches.filter(match => match.matchScore >= 70 && match.matchScore < 85).length,
      fair: jobMatches.filter(match => match.matchScore < 70).length
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Analysis</div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadGapAnalysisData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const overallScore = calculateOverallScore()
  const gapSummary = getSkillGapSummary()
  const matchSummary = getJobMatchSummary()

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gap Analysis Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {selectedJob 
              ? `Analysis for ${selectedJob.job.title} at ${selectedJob.job.company.name}`
              : 'Comprehensive skill gap analysis and career insights'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <ExportPanel 
            gapData={gapData}
            jobMatches={jobMatches}
            learningPath={learningPath}
          />
          {selectedJob && (
            <button
              onClick={() => {
                setSelectedJob(null)
                loadGapAnalysisData()
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Job Filter
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel filters={filters} onFiltersChange={setFilters} />

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Skill Match"
          value={`${overallScore}%`}
          subtitle="Current skill alignment"
          color={overallScore >= 80 ? 'green' : overallScore >= 60 ? 'yellow' : 'red'}
          trend={overallScore >= 70 ? 'up' : 'down'}
        />
        
        <MetricCard
          title="Critical Gaps"
          value={gapSummary.critical}
          subtitle="High priority skills needed"
          color={gapSummary.critical === 0 ? 'green' : gapSummary.critical <= 2 ? 'yellow' : 'red'}
        />
        
        <MetricCard
          title="Job Matches"
          value={matchSummary.excellent + matchSummary.good}
          subtitle="Strong fit opportunities"
          color="blue"
        />
        
        <MetricCard
          title="Learning Time"
          value={learningPath?.totalEstimatedTime || 'N/A'}
          subtitle="To close critical gaps"
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'skills', name: 'Skill Analysis', icon: '🎯' },
            { id: 'jobs', name: 'Job Matches', icon: '💼' },
            { id: 'learning', name: 'Learning Path', icon: '🛤️' },
            { id: 'industry', name: 'Industry Comparison', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Gap Overview */}
            {gapData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold mb-4">Skill Gap Overview</h3>
                
                {/* Critical Gaps */}
                {gapData.criticalGaps && gapData.criticalGaps.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-red-700 mb-3">Critical Skills Needed</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gapData.criticalGaps.slice(0, 6).map((gap, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-red-900">{gap.skill}</h5>
                            <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                              Gap: {gap.gap}
                            </span>
                          </div>
                          <p className="text-sm text-red-700 mb-2">{gap.learningTime}</p>
                          <div className="text-xs text-red-600">
                            Impact: +${gap.salaryImpact?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {gapData.strengths && gapData.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-3">Your Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {gapData.strengths.map((strength, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {gapData.recommendations && gapData.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-blue-700 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {gapData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <SkillChart 
            userSkills={userSkills}
            gapData={gapData}
            selectedJob={selectedJob}
          />
        )}

        {activeTab === 'jobs' && (
          <JobMatches 
            matches={jobMatches}
            onJobSelect={handleJobSelect}
            selectedJob={selectedJob}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPath 
            learningPath={learningPath}
            gapData={gapData}
          />
        )}

        {activeTab === 'industry' && (
          <IndustryComparison 
            userSkills={userSkills}
            industryData={industryData}
            gapData={gapData}
          />
        )}
      </div>
    </div>
  )
}

export default GapAnalysis


