import { instance } from './api.js'

/**
 * Skills API Service
 * Handles all skills management API calls
 */

// TypeScript-style interfaces for documentation
/**
 * @typedef {Object} Skill
 * @property {string} _id
 * @property {string} name
 * @property {string} category
 * @property {string} subcategory
 * @property {string} description
 * @property {number} marketDemand
 * @property {Array<Object>} proficiencyLevels
 * @property {Array<string>} learningResources
 */

/**
 * @typedef {Object} UserSkill
 * @property {string} skillId
 * @property {string} name
 * @property {number} selfRating
 * @property {Array<Object>} peerRatings
 * @property {number} averageRating
 * @property {string} evidence
 * @property {string} confidenceLevel
 * @property {Date} lastUpdated
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} name
 * @property {Array<Skill>} skills
 * @property {number} count
 */

class SkillsAPI {
  /**
   * Get all available skills
   * @param {Object} filters - Filter options
   * @param {string} filters.category - Filter by category
   * @param {string} filters.search - Search term
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{success: boolean, skills: Array<Skill>, pagination: Object}>}
   */
  async getAllSkills(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await instance.get(`/skills?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        skills: data.skills || data,
        pagination: data.pagination || {},
        message: 'Skills retrieved successfully'
      }
    } catch (error) {
      console.error('Get skills error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill categories
   * @returns {Promise<{success: boolean, categories: Array<SkillCategory>}>}
   */
  async getSkillCategories() {
    try {
      const response = await instance.get('/skills/categories')
      const { data } = response
      
      return {
        success: true,
        categories: data.categories || data,
        message: 'Categories retrieved successfully'
      }
    } catch (error) {
      console.error('Get categories error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skills by category
   * @param {string} category - Category name
   * @returns {Promise<{success: boolean, skills: Array<Skill>}>}
   */
  async getSkillsByCategory(category) {
    try {
      const response = await instance.get(`/skills/category/${encodeURIComponent(category)}`)
      const { data } = response
      
      return {
        success: true,
        skills: data.skills || data,
        message: 'Skills retrieved successfully'
      }
    } catch (error) {
      console.error('Get skills by category error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get user's skills
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<{success: boolean, skills: Array<UserSkill>}>}
   */
  async getUserSkills(userId = null) {
    try {
      const endpoint = userId ? `/skills/user/${userId}` : '/skills/me'
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        skills: data.skills || data,
        message: 'User skills retrieved successfully'
      }
    } catch (error) {
      console.error('Get user skills error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Add skill to user profile
   * @param {Object} skillData - Skill data
   * @param {string} skillData.skillId - Skill ID
   * @param {number} skillData.selfRating - Self rating (1-10)
   * @param {string} skillData.evidence - Evidence/experience
   * @param {string} skillData.confidenceLevel - Confidence level
   * @returns {Promise<{success: boolean, skill: UserSkill}>}
   */
  async addUserSkill(skillData) {
    try {
      const response = await instance.post('/skills/me', skillData)
      const { data } = response
      
      return {
        success: true,
        skill: data.skill || data,
        message: 'Skill added successfully'
      }
    } catch (error) {
      console.error('Add user skill error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update user skill
   * @param {string} skillId - Skill ID
   * @param {Object} updateData - Update data
   * @param {number} updateData.selfRating - Self rating (1-10)
   * @param {string} updateData.evidence - Evidence/experience
   * @param {string} updateData.confidenceLevel - Confidence level
   * @returns {Promise<{success: boolean, skill: UserSkill}>}
   */
  async updateUserSkill(skillId, updateData) {
    try {
      const response = await instance.put(`/skills/me/${skillId}`, updateData)
      const { data } = response
      
      return {
        success: true,
        skill: data.skill || data,
        message: 'Skill updated successfully'
      }
    } catch (error) {
      console.error('Update user skill error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Remove skill from user profile
   * @param {string} skillId - Skill ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async removeUserSkill(skillId) {
    try {
      const response = await instance.delete(`/skills/me/${skillId}`)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Skill removed successfully'
      }
    } catch (error) {
      console.error('Remove user skill error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Search skills by name
   * @param {string} query - Search query
   * @param {number} limit - Maximum results
   * @returns {Promise<{success: boolean, skills: Array<Skill>}>}
   */
  async searchSkills(query, limit = 20) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      })
      
      const response = await instance.get(`/skills/search?${params.toString()}`)
      const { data } = response
      
      return {
        success: true,
        skills: data.skills || data,
        message: 'Search completed successfully'
      }
    } catch (error) {
      console.error('Search skills error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill details
   * @param {string} skillId - Skill ID
   * @returns {Promise<{success: boolean, skill: Skill}>}
   */
  async getSkillDetails(skillId) {
    try {
      const response = await instance.get(`/skills/${skillId}`)
      const { data } = response
      
      return {
        success: true,
        skill: data.skill || data,
        message: 'Skill details retrieved successfully'
      }
    } catch (error) {
      console.error('Get skill details error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get trending skills
   * @param {number} limit - Number of skills to return
   * @returns {Promise<{success: boolean, skills: Array<Skill>}>}
   */
  async getTrendingSkills(limit = 10) {
    try {
      const response = await instance.get(`/skills/trending?limit=${limit}`)
      const { data } = response
      
      return {
        success: true,
        skills: data.skills || data,
        message: 'Trending skills retrieved successfully'
      }
    } catch (error) {
      console.error('Get trending skills error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skills with high market demand
   * @param {number} limit - Number of skills to return
   * @returns {Promise<{success: boolean, skills: Array<Skill>}>}
   */
  async getInDemandSkills(limit = 10) {
    try {
      const response = await instance.get(`/skills/in-demand?limit=${limit}`)
      const { data } = response
      
      return {
        success: true,
        skills: data.skills || data,
        message: 'In-demand skills retrieved successfully'
      }
    } catch (error) {
      console.error('Get in-demand skills error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill suggestions/recommendations for user
   * @param {Object} options - Options
   * @param {string} options.userId - User ID (optional)
   * @param {number} options.limit - Number of suggestions
   * @returns {Promise<{success: boolean, suggestions: Array<Skill>}>}
   */
  async getSkillSuggestions(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.limit) params.append('limit', options.limit.toString())
      
      const endpoint = options.userId 
        ? `/skills/suggestions/${options.userId}?${params.toString()}`
        : `/skills/suggestions/me?${params.toString()}`
      
      const response = await instance.get(endpoint)
      const { data } = response
      
      return {
        success: true,
        suggestions: data.suggestions || data,
        message: 'Skill suggestions retrieved successfully'
      }
    } catch (error) {
      console.error('Get skill suggestions error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get skill by ID with details
   * @param {string} skillId - Skill ID
   * @returns {Promise<{success: boolean, skill: Skill}>}
   */
  async getSkillById(skillId) {
    try {
      const response = await instance.get(`/skills/details/${skillId}`)
      const { data } = response
      
      return {
        success: true,
        skill: data.skill || data,
        message: 'Skill details retrieved successfully'
      }
    } catch (error) {
      console.error('Get skill by ID error:', error)
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
export default new SkillsAPI()