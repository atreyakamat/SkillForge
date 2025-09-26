import { instance } from './api.js'

/**
 * Jobs API Service
 * Handles job matching, search, and career opportunity management
 */

// TypeScript-style interfaces for documentation
/**
 * @typedef {Object} Job
 * @property {string} _id
 * @property {string} title
 * @property {string} company
 * @property {string} description
 * @property {Array<string>} requiredSkills
 * @property {Array<string>} preferredSkills
 * @property {string} location
 * @property {string} type
 * @property {string} level
 * @property {Object} salary
 * @property {Date} postedDate
 * @property {Date} closingDate
 * @property {string} industry
 * @property {boolean} remote
 * @property {Object} benefits
 */

/**
 * @typedef {Object} JobMatch
 * @property {Job} job
 * @property {number} matchScore
 * @property {Array<string>} matchingSkills
 * @property {Array<string>} missingSkills
 * @property {Object} skillGaps
 * @property {string} recommendation
 */

/**
 * @typedef {Object} JobApplication
 * @property {string} _id
 * @property {string} job
 * @property {string} user
 * @property {string} status
 * @property {Date} appliedDate
 * @property {string} coverLetter
 * @property {Array<string>} attachments
 * @property {Object} tracking
 */

class JobsAPI {
  /**
   * Search for jobs with filters
   * @param {Object} filters - Search filters
   * @param {string} filters.title - Job title keywords
   * @param {string} filters.company - Company name
   * @param {string} filters.location - Job location
   * @param {string} filters.industry - Industry filter
   * @param {string} filters.type - Job type ('full-time', 'part-time', 'contract', 'internship')
   * @param {string} filters.level - Experience level ('entry', 'mid', 'senior', 'executive')
   * @param {boolean} filters.remote - Remote work option
   * @param {Array<string>} filters.skills - Required skills
   * @param {Object} filters.salary - Salary range {min, max}
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.sortBy - Sort by ('relevance', 'date', 'salary', 'match')
   * @returns {Promise<{success: boolean, jobs: Array<Job>, pagination: Object}>}
   */
  async searchJobs(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      // Add all filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item))
          } else if (typeof value === 'object' && key === 'salary') {
            if (value.min) params.append('salaryMin', value.min.toString())
            if (value.max) params.append('salaryMax', value.max.toString())
          } else {
            params.append(key, value.toString())
          }
        }
      })
      
      const response = await instance.get(`/jobs/search?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        jobs: data.jobs || data,
        pagination: data.pagination || {},
        totalCount: data.totalCount || 0,
        message: 'Jobs retrieved successfully'
      }
    } catch (error) {
      console.error('Search jobs error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get personalized job matches based on user skills
   * @param {Object} options - Match options
   * @param {number} options.minMatchScore - Minimum match score (0-100)
   * @param {number} options.limit - Number of matches to return
   * @param {string} options.location - Preferred location
   * @param {string} options.industry - Preferred industry
   * @param {boolean} options.remoteOnly - Only remote jobs
   * @param {string} options.level - Experience level preference
   * @returns {Promise<{success: boolean, matches: Array<JobMatch>}>}
   */
  async getJobMatches(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.minMatchScore) params.append('minMatchScore', options.minMatchScore.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.location) params.append('location', options.location)
      if (options.industry) params.append('industry', options.industry)
      if (options.remoteOnly !== undefined) params.append('remoteOnly', options.remoteOnly.toString())
      if (options.level) params.append('level', options.level)
      
      const response = await instance.get(`/jobs/matches?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        matches: data.matches || data,
        totalCount: data.totalCount || 0,
        message: 'Job matches retrieved successfully'
      }
    } catch (error) {
      console.error('Get job matches error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get job details by ID
   * @param {string} jobId - Job ID
   * @param {boolean} includeMatch - Include match score if true
   * @returns {Promise<{success: boolean, job: Job, match?: Object}>}
   */
  async getJobById(jobId, includeMatch = false) {
    try {
      const params = includeMatch ? '?includeMatch=true' : ''
      const response = await instance.get(`/jobs/${jobId}${params}`)
      const { data } = response
      
      return {
        success: true,
        job: data.job || data,
        match: data.match || null,
        message: 'Job details retrieved successfully'
      }
    } catch (error) {
      console.error('Get job by ID error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Save a job to favorites
   * @param {string} jobId - Job ID
   * @param {Object} notes - Optional notes about the job
   * @param {string} notes.personalNotes - Personal notes
   * @param {Array<string>} notes.tags - Custom tags
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async saveJob(jobId, notes = {}) {
    try {
      const response = await instance.post(`/jobs/${jobId}/save`, notes)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Job saved successfully'
      }
    } catch (error) {
      console.error('Save job error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Remove job from favorites
   * @param {string} jobId - Job ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async unsaveJob(jobId) {
    try {
      const response = await instance.delete(`/jobs/${jobId}/save`)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Job removed from favorites'
      }
    } catch (error) {
      console.error('Unsave job error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get saved jobs
   * @param {Object} filters - Filter options
   * @param {string} filters.industry - Filter by industry
   * @param {string} filters.location - Filter by location
   * @param {string} filters.tag - Filter by custom tag
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, jobs: Array<Job>, pagination: Object}>}
   */
  async getSavedJobs(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.industry) params.append('industry', filters.industry)
      if (filters.location) params.append('location', filters.location)
      if (filters.tag) params.append('tag', filters.tag)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/jobs/saved?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        jobs: data.jobs || data,
        pagination: data.pagination || {},
        message: 'Saved jobs retrieved successfully'
      }
    } catch (error) {
      console.error('Get saved jobs error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Apply to a job
   * @param {string} jobId - Job ID
   * @param {Object} applicationData - Application data
   * @param {string} applicationData.coverLetter - Cover letter
   * @param {Array<string>} applicationData.attachments - File attachment IDs
   * @param {Object} applicationData.customResponses - Custom application questions responses
   * @returns {Promise<{success: boolean, application: JobApplication}>}
   */
  async applyToJob(jobId, applicationData) {
    try {
      const response = await instance.post(`/jobs/${jobId}/apply`, applicationData)
      const { data } = response
      
      return {
        success: true,
        application: data.application || data,
        message: 'Application submitted successfully'
      }
    } catch (error) {
      console.error('Apply to job error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get user's job applications
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status ('pending', 'reviewing', 'interviewed', 'offered', 'rejected', 'withdrawn')
   * @param {string} filters.company - Filter by company
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, applications: Array<JobApplication>, pagination: Object}>}
   */
  async getMyApplications(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.company) params.append('company', filters.company)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/jobs/applications?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        applications: data.applications || data,
        pagination: data.pagination || {},
        message: 'Applications retrieved successfully'
      }
    } catch (error) {
      console.error('Get my applications error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update application status or notes
   * @param {string} applicationId - Application ID
   * @param {Object} updateData - Update data
   * @param {string} updateData.status - New status
   * @param {string} updateData.notes - Application notes
   * @param {Object} updateData.tracking - Interview/process tracking info
   * @returns {Promise<{success: boolean, application: JobApplication}>}
   */
  async updateApplication(applicationId, updateData) {
    try {
      const response = await instance.put(`/jobs/applications/${applicationId}`, updateData)
      const { data } = response
      
      return {
        success: true,
        application: data.application || data,
        message: 'Application updated successfully'
      }
    } catch (error) {
      console.error('Update application error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Withdraw job application
   * @param {string} applicationId - Application ID
   * @param {string} reason - Reason for withdrawal (optional)
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async withdrawApplication(applicationId, reason = '') {
    try {
      const response = await instance.delete(`/jobs/applications/${applicationId}`, {
        data: { reason }
      })
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Application withdrawn successfully'
      }
    } catch (error) {
      console.error('Withdraw application error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get job recommendations based on career goals
   * @param {Object} preferences - Career preferences
   * @param {Array<string>} preferences.desiredRoles - Desired job titles/roles
   * @param {Array<string>} preferences.industries - Preferred industries
   * @param {Array<string>} preferences.locations - Preferred locations
   * @param {boolean} preferences.remotePreference - Remote work preference
   * @param {string} preferences.careerStage - Career stage ('early', 'mid', 'senior', 'executive')
   * @param {number} preferences.limit - Number of recommendations
   * @returns {Promise<{success: boolean, recommendations: Array<JobMatch>}>}
   */
  async getJobRecommendations(preferences = {}) {
    try {
      const response = await instance.post('/jobs/recommendations', preferences)
      const { data } = response
      
      return {
        success: true,
        recommendations: data.recommendations || data,
        message: 'Job recommendations retrieved successfully'
      }
    } catch (error) {
      console.error('Get job recommendations error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get job market insights
   * @param {Object} filters - Analysis filters
   * @param {Array<string>} filters.skills - Skills to analyze
   * @param {string} filters.location - Geographic location
   * @param {string} filters.industry - Industry focus
   * @param {string} filters.timeframe - Analysis timeframe ('month', 'quarter', 'year')
   * @returns {Promise<{success: boolean, insights: Object}>}
   */
  async getMarketInsights(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.skills) {
        filters.skills.forEach(skill => params.append('skills', skill))
      }
      if (filters.location) params.append('location', filters.location)
      if (filters.industry) params.append('industry', filters.industry)
      if (filters.timeframe) params.append('timeframe', filters.timeframe)
      
      const response = await instance.get(`/jobs/market-insights?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        insights: data.insights || data,
        message: 'Market insights retrieved successfully'
      }
    } catch (error) {
      console.error('Get market insights error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get salary insights for specific roles/skills
   * @param {Object} criteria - Salary analysis criteria
   * @param {string} criteria.role - Job role/title
   * @param {Array<string>} criteria.skills - Relevant skills
   * @param {string} criteria.location - Location for salary comparison
   * @param {string} criteria.experience - Experience level
   * @returns {Promise<{success: boolean, salaryData: Object}>}
   */
  async getSalaryInsights(criteria = {}) {
    try {
      const params = new URLSearchParams()
      if (criteria.role) params.append('role', criteria.role)
      if (criteria.skills) {
        criteria.skills.forEach(skill => params.append('skills', skill))
      }
      if (criteria.location) params.append('location', criteria.location)
      if (criteria.experience) params.append('experience', criteria.experience)
      
      const response = await instance.get(`/jobs/salary-insights?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        salaryData: data.salaryData || data,
        message: 'Salary insights retrieved successfully'
      }
    } catch (error) {
      console.error('Get salary insights error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Set job alerts based on criteria
   * @param {Object} alertData - Alert criteria
   * @param {string} alertData.name - Alert name
   * @param {Object} alertData.criteria - Search criteria (same as searchJobs filters)
   * @param {string} alertData.frequency - Alert frequency ('daily', 'weekly', 'monthly')
   * @param {boolean} alertData.enabled - Whether alert is active
   * @returns {Promise<{success: boolean, alert: Object}>}
   */
  async createJobAlert(alertData) {
    try {
      const response = await instance.post('/jobs/alerts', alertData)
      const { data } = response
      
      return {
        success: true,
        alert: data.alert || data,
        message: 'Job alert created successfully'
      }
    } catch (error) {
      console.error('Create job alert error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get user's job alerts
   * @returns {Promise<{success: boolean, alerts: Array<Object>}>}
   */
  async getJobAlerts() {
    try {
      const response = await instance.get('/jobs/alerts')
      const { data } = response
      
      return {
        success: true,
        alerts: data.alerts || data,
        message: 'Job alerts retrieved successfully'
      }
    } catch (error) {
      console.error('Get job alerts error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update job alert
   * @param {string} alertId - Alert ID
   * @param {Object} updateData - Update data
   * @returns {Promise<{success: boolean, alert: Object}>}
   */
  async updateJobAlert(alertId, updateData) {
    try {
      const response = await instance.put(`/jobs/alerts/${alertId}`, updateData)
      const { data } = response
      
      return {
        success: true,
        alert: data.alert || data,
        message: 'Job alert updated successfully'
      }
    } catch (error) {
      console.error('Update job alert error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete job alert
   * @param {string} alertId - Alert ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async deleteJobAlert(alertId) {
    try {
      const response = await instance.delete(`/jobs/alerts/${alertId}`)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Job alert deleted successfully'
      }
    } catch (error) {
      console.error('Delete job alert error:', error)
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
export default new JobsAPI()