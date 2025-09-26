import { instance } from './api.js'

/**
 * Assessment API Service
 * Handles skill assessments and evaluation operations
 */

// TypeScript-style interfaces for documentation
/**
 * @typedef {Object} Assessment
 * @property {string} _id
 * @property {string} user
 * @property {string} skill
 * @property {number} selfRating
 * @property {number} confidence
 * @property {string} evidence
 * @property {Date} assessmentDate
 * @property {Array<Object>} peerReviews
 * @property {number} averageRating
 * @property {string} validationStatus
 * @property {Array<string>} gaps
 * @property {Array<string>} recommendations
 */

/**
 * @typedef {Object} CreateAssessmentData
 * @property {string} skillId
 * @property {number} selfRating
 * @property {number} confidence
 * @property {string} evidence
 */

/**
 * @typedef {Object} SkillProgression
 * @property {string} skillName
 * @property {Array<Object>} history
 * @property {number} currentRating
 * @property {number} previousRating
 * @property {number} trend
 */

class AssessmentAPI {
  /**
   * Create a new skill assessment
   * @param {CreateAssessmentData} assessmentData - Assessment data
   * @returns {Promise<{success: boolean, assessment: Assessment}>}
   */
  async createAssessment(assessmentData) {
    try {
      const response = await instance.post('/assessment', assessmentData)
      const { data } = response
      
      return {
        success: true,
        assessment: data.assessment || data,
        message: 'Assessment created successfully'
      }
    } catch (error) {
      console.error('Create assessment error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get current user's assessments
   * @param {Object} filters - Filter options
   * @param {string} filters.skill - Filter by skill name
   * @param {string} filters.validationStatus - Filter by validation status
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, assessments: Array<Assessment>, pagination: Object}>}
   */
  async getMyAssessments(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filters.skill) params.append('skill', filters.skill)
      if (filters.validationStatus) params.append('validationStatus', filters.validationStatus)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/assessment/me?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        assessments: data.assessments || data,
        pagination: data.pagination || {},
        message: 'Assessments retrieved successfully'
      }
    } catch (error) {
      console.error('Get assessments error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update an existing assessment
   * @param {string} assessmentId - Assessment ID
   * @param {Object} updateData - Update data
   * @param {number} updateData.selfRating - Self rating (1-10)
   * @param {number} updateData.confidence - Confidence level (1-10)
   * @param {string} updateData.evidence - Evidence/experience
   * @returns {Promise<{success: boolean, assessment: Assessment}>}
   */
  async updateAssessment(assessmentId, updateData) {
    try {
      const response = await instance.put(`/assessment/${assessmentId}`, updateData)
      const { data } = response
      
      return {
        success: true,
        assessment: data.assessment || data,
        message: 'Assessment updated successfully'
      }
    } catch (error) {
      console.error('Update assessment error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async deleteAssessment(assessmentId) {
    try {
      const response = await instance.delete(`/assessment/${assessmentId}`)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Assessment deleted successfully'
      }
    } catch (error) {
      console.error('Delete assessment error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get assessment history for a user
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {Object} options - Options
   * @param {number} options.limit - Number of assessments to return
   * @param {string} options.skillId - Filter by specific skill
   * @returns {Promise<{success: boolean, history: Array<Assessment>}>}
   */
  async getAssessmentHistory(userId = null, options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.skillId) params.append('skillId', options.skillId)
      
      const endpoint = userId 
        ? `/assessment/history/${userId}?${params.toString()}`
        : `/assessment/history/me?${params.toString()}`
        
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        history: data.history || data,
        message: 'Assessment history retrieved successfully'
      }
    } catch (error) {
      console.error('Get assessment history error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill progression over time
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {Object} options - Options
   * @param {string} options.timeframe - Time frame ('month', 'quarter', 'year')
   * @param {Array<string>} options.skills - Specific skills to track
   * @returns {Promise<{success: boolean, progression: Array<SkillProgression>}>}
   */
  async getSkillProgression(userId = null, options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.timeframe) params.append('timeframe', options.timeframe)
      if (options.skills) {
        options.skills.forEach(skill => params.append('skills', skill))
      }
      
      const endpoint = userId 
        ? `/assessment/progression/${userId}?${params.toString()}`
        : `/assessment/progression/me?${params.toString()}`
        
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        progression: data.progression || data,
        message: 'Skill progression retrieved successfully'
      }
    } catch (error) {
      console.error('Get skill progression error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Generate assessment report
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {Object} options - Report options
   * @param {string} options.format - Report format ('json', 'pdf')
   * @param {Array<string>} options.includeSkills - Specific skills to include
   * @param {boolean} options.includePeerReviews - Include peer review data
   * @returns {Promise<{success: boolean, report: Object}>}
   */
  async generateAssessmentReport(userId = null, options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.format) params.append('format', options.format)
      if (options.includePeerReviews !== undefined) {
        params.append('includePeerReviews', options.includePeerReviews.toString())
      }
      if (options.includeSkills) {
        options.includeSkills.forEach(skill => params.append('includeSkills', skill))
      }
      
      const endpoint = userId 
        ? `/assessment/report/${userId}?${params.toString()}`
        : `/assessment/report/me?${params.toString()}`
        
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        report: data.report || data,
        message: 'Assessment report generated successfully'
      }
    } catch (error) {
      console.error('Generate assessment report error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get assessment statistics
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<{success: boolean, stats: Object}>}
   */
  async getAssessmentStats(userId = null) {
    try {
      const endpoint = userId ? `/assessment/stats/${userId}` : '/assessment/stats/me'
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        stats: data.stats || data,
        message: 'Assessment statistics retrieved successfully'
      }
    } catch (error) {
      console.error('Get assessment stats error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Submit multiple assessments at once
   * @param {Array<CreateAssessmentData>} assessments - Array of assessment data
   * @returns {Promise<{success: boolean, assessments: Array<Assessment>, errors: Array}>}
   */
  async bulkCreateAssessments(assessments) {
    try {
      const response = await instance.post('/assessment/bulk', { assessments })
      const { data } = response
      
      return {
        success: true,
        assessments: data.assessments || data.created || [],
        errors: data.errors || [],
        message: `Successfully created ${data.assessments?.length || 0} assessments`
      }
    } catch (error) {
      console.error('Bulk create assessments error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get assessment by ID
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<{success: boolean, assessment: Assessment}>}
   */
  async getAssessmentById(assessmentId) {
    try {
      const response = await instance.get(`/assessment/${assessmentId}`)
      const { data } = response
      
      return {
        success: true,
        assessment: data.assessment || data,
        message: 'Assessment retrieved successfully'
      }
    } catch (error) {
      console.error('Get assessment by ID error:', error)
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
export default new AssessmentAPI()