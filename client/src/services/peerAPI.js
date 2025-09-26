import { instance } from './api.js'

/**
 * Peer Review API Service
 * Handles peer review requests, submissions, and management
 */

// TypeScript-style interfaces for documentation
/**
 * @typedef {Object} PeerReview
 * @property {string} _id
 * @property {string} assessment
 * @property {string} reviewer
 * @property {string} reviewee
 * @property {number} rating
 * @property {string} feedback
 * @property {Date} reviewDate
 * @property {string} status
 * @property {Object} skillEvaluation
 */

/**
 * @typedef {Object} ReviewRequest
 * @property {string} _id
 * @property {string} requester
 * @property {string} reviewer
 * @property {string} assessment
 * @property {string} status
 * @property {Date} requestDate
 * @property {Date} dueDate
 * @property {string} message
 */

/**
 * @typedef {Object} CreateReviewRequestData
 * @property {string} assessmentId
 * @property {string} reviewerId
 * @property {string} message
 * @property {Date} dueDate
 */

class PeerReviewAPI {
  /**
   * Request a peer review for an assessment
   * @param {CreateReviewRequestData} requestData - Review request data
   * @returns {Promise<{success: boolean, request: ReviewRequest}>}
   */
  async requestReview(requestData) {
    try {
      const response = await instance.post('/peer-review/request', requestData)
      const { data } = response
      
      return {
        success: true,
        request: data.request || data,
        message: 'Review request sent successfully'
      }
    } catch (error) {
      console.error('Request review error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get review requests sent by current user
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status ('pending', 'accepted', 'completed', 'declined')
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, requests: Array<ReviewRequest>, pagination: Object}>}
   */
  async getMyRequests(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/peer-review/my-requests?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        requests: data.requests || data,
        pagination: data.pagination || {},
        message: 'Review requests retrieved successfully'
      }
    } catch (error) {
      console.error('Get my requests error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get review requests received by current user
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, requests: Array<ReviewRequest>, pagination: Object}>}
   */
  async getReceivedRequests(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/peer-review/received-requests?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        requests: data.requests || data,
        pagination: data.pagination || {},
        message: 'Received requests retrieved successfully'
      }
    } catch (error) {
      console.error('Get received requests error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Accept a review request
   * @param {string} requestId - Review request ID
   * @param {Object} options - Accept options
   * @param {string} options.message - Optional acceptance message
   * @returns {Promise<{success: boolean, request: ReviewRequest}>}
   */
  async acceptRequest(requestId, options = {}) {
    try {
      const response = await instance.put(`/peer-review/request/${requestId}/accept`, options)
      const { data } = response
      
      return {
        success: true,
        request: data.request || data,
        message: 'Review request accepted successfully'
      }
    } catch (error) {
      console.error('Accept request error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Decline a review request
   * @param {string} requestId - Review request ID
   * @param {Object} options - Decline options
   * @param {string} options.reason - Reason for declining
   * @returns {Promise<{success: boolean, request: ReviewRequest}>}
   */
  async declineRequest(requestId, options = {}) {
    try {
      const response = await instance.put(`/peer-review/request/${requestId}/decline`, options)
      const { data } = response
      
      return {
        success: true,
        request: data.request || data,
        message: 'Review request declined'
      }
    } catch (error) {
      console.error('Decline request error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Submit a peer review
   * @param {string} requestId - Review request ID
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-10)
   * @param {string} reviewData.feedback - Written feedback
   * @param {Object} reviewData.skillEvaluation - Detailed skill evaluation
   * @param {Array<string>} reviewData.strengths - Identified strengths
   * @param {Array<string>} reviewData.improvements - Areas for improvement
   * @returns {Promise<{success: boolean, review: PeerReview}>}
   */
  async submitReview(requestId, reviewData) {
    try {
      const response = await instance.post(`/peer-review/request/${requestId}/submit`, reviewData)
      const { data } = response
      
      return {
        success: true,
        review: data.review || data,
        message: 'Review submitted successfully'
      }
    } catch (error) {
      console.error('Submit review error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get reviews written by current user
   * @param {Object} filters - Filter options
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.sortBy - Sort by ('reviewDate', 'rating')
   * @returns {Promise<{success: boolean, reviews: Array<PeerReview>, pagination: Object}>}
   */
  async getMyReviews(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      
      const response = await instance.get(`/peer-review/my-reviews?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        reviews: data.reviews || data,
        pagination: data.pagination || {},
        message: 'Reviews retrieved successfully'
      }
    } catch (error) {
      console.error('Get my reviews error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get reviews received by current user
   * @param {Object} filters - Filter options
   * @param {string} filters.assessmentId - Filter by assessment ID
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, reviews: Array<PeerReview>, pagination: Object}>}
   */
  async getReceivedReviews(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.assessmentId) params.append('assessmentId', filters.assessmentId)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/peer-review/received-reviews?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        reviews: data.reviews || data,
        pagination: data.pagination || {},
        message: 'Received reviews retrieved successfully'
      }
    } catch (error) {
      console.error('Get received reviews error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update a review (before final submission)
   * @param {string} reviewId - Review ID
   * @param {Object} updateData - Update data
   * @param {number} updateData.rating - Updated rating
   * @param {string} updateData.feedback - Updated feedback
   * @param {Object} updateData.skillEvaluation - Updated skill evaluation
   * @returns {Promise<{success: boolean, review: PeerReview}>}
   */
  async updateReview(reviewId, updateData) {
    try {
      const response = await instance.put(`/peer-review/${reviewId}`, updateData)
      const { data } = response
      
      return {
        success: true,
        review: data.review || data,
        message: 'Review updated successfully'
      }
    } catch (error) {
      console.error('Update review error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete a review request (if not yet accepted)
   * @param {string} requestId - Review request ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async deleteRequest(requestId) {
    try {
      const response = await instance.delete(`/peer-review/request/${requestId}`)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Review request deleted successfully'
      }
    } catch (error) {
      console.error('Delete request error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get review statistics for current user
   * @returns {Promise<{success: boolean, stats: Object}>}
   */
  async getReviewStats() {
    try {
      const response = await instance.get('/peer-review/stats')
      const { data } = response
      
      return {
        success: true,
        stats: data.stats || data,
        message: 'Review statistics retrieved successfully'
      }
    } catch (error) {
      console.error('Get review stats error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get potential reviewers for a skill/assessment
   * @param {Object} criteria - Search criteria
   * @param {string} criteria.skillName - Skill name
   * @param {string} criteria.skillLevel - Required skill level
   * @param {number} criteria.minRating - Minimum reviewer rating
   * @param {number} criteria.limit - Number of suggestions
   * @returns {Promise<{success: boolean, reviewers: Array<Object>}>}
   */
  async getSuggestedReviewers(criteria = {}) {
    try {
      const params = new URLSearchParams()
      if (criteria.skillName) params.append('skillName', criteria.skillName)
      if (criteria.skillLevel) params.append('skillLevel', criteria.skillLevel)
      if (criteria.minRating) params.append('minRating', criteria.minRating.toString())
      if (criteria.limit) params.append('limit', criteria.limit.toString())
      
      const response = await instance.get(`/peer-review/suggested-reviewers?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        reviewers: data.reviewers || data,
        message: 'Suggested reviewers retrieved successfully'
      }
    } catch (error) {
      console.error('Get suggested reviewers error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Rate the quality of a received review
   * @param {string} reviewId - Review ID
   * @param {Object} ratingData - Rating data
   * @param {number} ratingData.helpfulness - Helpfulness rating (1-5)
   * @param {number} ratingData.accuracy - Accuracy rating (1-5)
   * @param {string} ratingData.feedback - Optional feedback on the review
   * @returns {Promise<{success: boolean, rating: Object}>}
   */
  async rateReview(reviewId, ratingData) {
    try {
      const response = await instance.post(`/peer-review/${reviewId}/rate`, ratingData)
      const { data } = response
      
      return {
        success: true,
        rating: data.rating || data,
        message: 'Review rated successfully'
      }
    } catch (error) {
      console.error('Rate review error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get review history for a specific assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<{success: boolean, history: Array<PeerReview>}>}
   */
  async getAssessmentReviewHistory(assessmentId) {
    try {
      const response = await instance.get(`/peer-review/assessment/${assessmentId}/history`)
      const { data } = response
      
      return {
        success: true,
        history: data.history || data,
        message: 'Assessment review history retrieved successfully'
      }
    } catch (error) {
      console.error('Get assessment review history error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Send reminder for pending review request
   * @param {string} requestId - Review request ID
   * @param {Object} reminderData - Reminder data
   * @param {string} reminderData.message - Optional reminder message
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendReminder(requestId, reminderData = {}) {
    try {
      const response = await instance.post(`/peer-review/request/${requestId}/remind`, reminderData)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Reminder sent successfully'
      }
    } catch (error) {
      console.error('Send reminder error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get review template for a specific skill
   * @param {string} skillName - Skill name
   * @returns {Promise<{success: boolean, template: Object}>}
   */
  async getReviewTemplate(skillName) {
    try {
      const response = await instance.get(`/peer-review/template/${encodeURIComponent(skillName)}`)
      const { data } = response
      
      return {
        success: true,
        template: data.template || data,
        message: 'Review template retrieved successfully'
      }
    } catch (error) {
      console.error('Get review template error:', error)
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
export default new PeerReviewAPI()

// Also export as peerAPI for compatibility
export const peerAPI = new PeerReviewAPI()