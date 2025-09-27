import { instance } from './api.js'

/**
 * Analytics API Service
 * Handles analytics, insights, and data visualization operations
 */

// TypeScript-style interfaces for documentation
/**
 * @typedef {Object} DevelopmentPlan
 * @property {string} _id
 * @property {string} user
 * @property {Array<Object>} goals
 * @property {Array<Object>} steps
 * @property {string} timeline
 * @property {string} status
 * @property {number} progress
 */

/**
 * @typedef {Object} JobMatch
 * @property {string} jobId
 * @property {string} title
 * @property {string} company
 * @property {number} matchScore
 * @property {Array<string>} matchingSkills
 * @property {Array<string>} missingSkills
 * @property {string} location
 * @property {string} salaryRange
 */

/**
 * @typedef {Object} LearningPath
 * @property {string} skillName
 * @property {number} currentLevel
 * @property {number} targetLevel
 * @property {Array<Object>} milestones
 * @property {number} estimatedTime
 * @property {Array<string>} resources
 */

class AnalyticsAPI {
  /**
   * Get development plan for user
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {Object} options - Options
   * @param {string} options.timeframe - Plan timeframe ('month', 'quarter', 'year')
   * @param {Array<string>} options.focusSkills - Skills to focus on
   * @returns {Promise<{success: boolean, plan: DevelopmentPlan}>}
   */
  async getDevelopmentPlan(userId = null, options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.timeframe) params.append('timeframe', options.timeframe)
      if (options.focusSkills) {
        options.focusSkills.forEach(skill => params.append('focusSkills', skill))
      }
      
      const endpoint = userId 
        ? `/analytics/development-plan/${userId}?${params.toString()}`
        : `/analytics/development-plan/me?${params.toString()}`
        
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        plan: data.developmentPlan || data.plan || data,
        skillAnalysis: data.skillAnalysis,
        user: data.user,
        message: 'Development plan retrieved successfully'
      }
    } catch (error) {
      console.error('Get development plan error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Create or update development plan
   * @param {Object} planData - Development plan data
   * @param {Array<Object>} planData.goals - Learning goals
   * @param {string} planData.timeline - Timeline for completion
   * @param {Array<string>} planData.prioritySkills - Priority skills to develop
   * @returns {Promise<{success: boolean, plan: DevelopmentPlan}>}
   */
  async createDevelopmentPlan(planData) {
    try {
      const response = await instance.post('/analytics/development-plan', planData)
      const { data } = response
      
      return {
        success: true,
        plan: data.plan || data,
        message: 'Development plan created successfully'
      }
    } catch (error) {
      console.error('Create development plan error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get job matches based on user skills
   * @param {Object} filters - Filter options
   * @param {string} filters.location - Job location
   * @param {string} filters.industry - Industry filter
   * @param {number} filters.minMatchScore - Minimum match score (0-100)
   * @param {number} filters.limit - Number of results
   * @param {string} filters.sortBy - Sort by ('matchScore', 'postedDate', 'salary')
   * @returns {Promise<{success: boolean, matches: Array<JobMatch>}>}
   */
  async getJobMatches(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.location) params.append('location', filters.location)
      if (filters.industry) params.append('industry', filters.industry)
      if (filters.minMatchScore) params.append('minMatchScore', filters.minMatchScore.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      
      const response = await instance.get(`/analytics/jobs/matches/me?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        matches: data.matches || data,
        totalCount: data.totalCount || 0,
        user: data.user,
        message: 'Job matches retrieved successfully'
      }
    } catch (error) {
      console.error('Get job matches error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get learning paths for skill development
   * @param {Object} options - Options
   * @param {Array<string>} options.targetSkills - Skills to develop
   * @param {string} options.experience - Experience level ('beginner', 'intermediate', 'advanced')
   * @param {number} options.timeAvailable - Hours per week available
   * @returns {Promise<{success: boolean, paths: Array<LearningPath>}>}
   */
  async getLearningPaths(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.targetSkills) {
        options.targetSkills.forEach(skill => params.append('targetSkills', skill))
      }
      if (options.experience) params.append('experience', options.experience)
      if (options.timeAvailable) params.append('timeAvailable', options.timeAvailable.toString())
      
      const response = await instance.get(`/analytics/learning-path/me?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        paths: data.learningPath || data.paths || data,
        user: data.user,
        message: 'Learning paths retrieved successfully'
      }
    } catch (error) {
      console.error('Get learning paths error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill benchmarks and comparisons
   * @param {Object} options - Options
   * @param {Array<string>} options.skills - Skills to benchmark
   * @param {string} options.industry - Industry for comparison
   * @param {string} options.role - Role/position for comparison
   * @param {string} options.experience - Experience level
   * @returns {Promise<{success: boolean, benchmarks: Object}>}
   */
  async getSkillBenchmarks(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.skills) {
        options.skills.forEach(skill => params.append('skills', skill))
      }
      if (options.industry) params.append('industry', options.industry)
      if (options.role) params.append('role', options.role)
      if (options.experience) params.append('experience', options.experience)
      
      const response = await instance.get(`/analytics/benchmarks?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        benchmarks: data.benchmarks || data,
        message: 'Skill benchmarks retrieved successfully'
      }
    } catch (error) {
      console.error('Get skill benchmarks error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skills trends and market insights
   * @param {Object} options - Options
   * @param {string} options.timeframe - Time frame ('month', 'quarter', 'year')
   * @param {string} options.industry - Industry filter
   * @param {string} options.region - Geographic region
   * @param {number} options.limit - Number of trending skills
   * @returns {Promise<{success: boolean, trends: Object}>}
   */
  async getSkillsTrends(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.timeframe) params.append('timeframe', options.timeframe)
      if (options.industry) params.append('industry', options.industry)
      if (options.region) params.append('region', options.region)
      if (options.limit) params.append('limit', options.limit.toString())
      
      const response = await instance.get(`/analytics/trends?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        trends: data.trends || data,
        message: 'Skills trends retrieved successfully'
      }
    } catch (error) {
      console.error('Get skills trends error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get user analytics dashboard data
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {Object} options - Options
   * @param {string} options.period - Time period ('week', 'month', 'quarter', 'year')
   * @returns {Promise<{success: boolean, dashboard: Object}>}
   */
  async getDashboardData(userId = null, options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.period) params.append('period', options.period)
      
      const endpoint = userId 
        ? `/analytics/dashboard/${userId}?${params.toString()}`
        : `/analytics/dashboard/me?${params.toString()}`
        
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        dashboard: data.dashboard || data,
        message: 'Dashboard data retrieved successfully'
      }
    } catch (error) {
      console.error('Get dashboard data error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill gap analysis
   * @param {Object} options - Options
   * @param {string} options.targetRole - Target job role
   * @param {string} options.industry - Target industry
   * @param {Array<string>} options.requiredSkills - Specific required skills
   * @returns {Promise<{success: boolean, analysis: Object}>}
   */
  async getSkillGapAnalysis(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.targetRole) params.append('targetRole', options.targetRole)
      if (options.industry) params.append('industry', options.industry)
      if (options.requiredSkills) {
        options.requiredSkills.forEach(skill => params.append('requiredSkills', skill))
      }
      
      const response = await instance.get(`/analytics/skill-gap?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        analysis: data.analysis || data,
        message: 'Skill gap analysis completed successfully'
      }
    } catch (error) {
      console.error('Get skill gap analysis error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get progress tracking data
   * @param {Object} options - Options
   * @param {string} options.timeframe - Time frame for progress tracking
   * @param {Array<string>} options.skills - Specific skills to track
   * @param {string} options.goalId - Specific goal ID to track
   * @returns {Promise<{success: boolean, progress: Object}>}
   */
  async getProgressTracking(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.timeframe) params.append('timeframe', options.timeframe)
      if (options.skills) {
        options.skills.forEach(skill => params.append('skills', skill))
      }
      if (options.goalId) params.append('goalId', options.goalId)
      
      const response = await instance.get(`/analytics/progress?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        progress: data.progress || data,
        message: 'Progress tracking data retrieved successfully'
      }
    } catch (error) {
      console.error('Get progress tracking error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get recommendations for skill development
   * @param {Object} options - Options
   * @param {string} options.careerGoal - Career goal or target role
   * @param {number} options.experienceLevel - Experience level (1-10)
   * @param {Array<string>} options.interests - Areas of interest
   * @param {number} options.limit - Number of recommendations
   * @returns {Promise<{success: boolean, recommendations: Array}>}
   */
  async getRecommendations(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.careerGoal) params.append('careerGoal', options.careerGoal)
      if (options.experienceLevel) params.append('experienceLevel', options.experienceLevel.toString())
      if (options.interests) {
        options.interests.forEach(interest => params.append('interests', interest))
      }
      if (options.limit) params.append('limit', options.limit.toString())
      
      const response = await instance.get(`/analytics/recommendations?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        recommendations: data.recommendations || data,
        message: 'Recommendations retrieved successfully'
      }
    } catch (error) {
      console.error('Get recommendations error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Export analytics data
   * @param {Object} options - Export options
   * @param {string} options.format - Export format ('json', 'csv', 'pdf')
   * @param {string} options.dataType - Type of data to export
   * @param {string} options.dateRange - Date range for export
   * @returns {Promise<{success: boolean, exportUrl: string}>}
   */
  async exportData(options = {}) {
    try {
      const response = await instance.post('/analytics/export', options)
      const { data } = response
      
      return {
        success: true,
        exportUrl: data.exportUrl || data.url,
        message: 'Data export initiated successfully'
      }
    } catch (error) {
      console.error('Export data error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors and format them consistently
   * @private
   * @param {Error} error - Axios error
   * @returns {Object}
   */
  handleError(error) {
    if (error.response) {
      const { data, status } = error.response
      return {
        success: false,
        message: data.message || `Request failed with status ${status}`,
        errors: data.errors || [],
        status
      }
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        errors: ['NETWORK_ERROR']
      }
    } else {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        errors: ['UNKNOWN_ERROR']
      }
    }
  }
}

// Export singleton instance
export default new AnalyticsAPI()