import { instance, setToken, clearTokens } from './api.js'

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

// TypeScript-style interfaces for documentation
/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success
 * @property {Object} user
 * @property {Object} tokens
 * @property {string} tokens.access
 * @property {string} tokens.refresh
 * @property {string} message
 */

/**
 * @typedef {Object} ApiError
 * @property {boolean} success
 * @property {string} message
 * @property {Array<string>} errors
 */

class AuthAPI {
  /**
   * Register a new user
   * @param {RegisterData} userData - User registration data
   * @returns {Promise<AuthResponse>}
   */
  async register(userData) {
    try {
      const response = await instance.post('/auth/register', userData)
      const { data } = response
      
      // Store tokens
      if (data.tokens?.access) {
        setToken(data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
      }
      
      return {
        success: true,
        user: data.user,
        tokens: data.tokens,
        message: data.message || 'Registration successful'
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Login user
   * @param {LoginCredentials} credentials - Login credentials
   * @returns {Promise<AuthResponse>}
   */
  async login(credentials) {
    try {
      const response = await instance.post('/auth/login', credentials)
      const { data } = response
      
      // Store tokens
      if (data.tokens?.access) {
        setToken(data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
      }
      
      return {
        success: true,
        user: data.user,
        tokens: data.tokens,
        message: data.message || 'Login successful'
      }
    } catch (error) {
      console.error('Login error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Logout user
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async logout() {
    try {
      await instance.post('/auth/logout')
      clearTokens()
      
      return {
        success: true,
        message: 'Logout successful'
      }
    } catch (error) {
      // Clear tokens even if logout fails
      clearTokens()
      console.error('Logout error:', error)
      
      return {
        success: true,
        message: 'Logout completed'
      }
    }
  }

  /**
   * Refresh access token
   * @returns {Promise<{success: boolean, tokens: Object}>}
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await instance.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      })
      
      const { data } = response
      
      if (data.tokens?.access) {
        setToken(data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
      }
      
      return {
        success: true,
        tokens: data.tokens
      }
    } catch (error) {
      clearTokens()
      throw this.handleError(error)
    }
  }

  /**
   * Send forgot password email
   * @param {string} email - User email
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async forgotPassword(email) {
    try {
      const response = await instance.post('/auth/forgot-password', { email })
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Password reset email sent'
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await instance.post('/auth/reset-password', {
        token,
        password: newPassword
      })
      
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Password reset successful'
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyEmail(token) {
    try {
      const response = await instance.get(`/auth/verify-email/${token}`)
      const { data } = response
      
      return {
        success: true,
        message: data.message || 'Email verified successfully'
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<{success: boolean, user: Object}>}
   */
  async getCurrentUser() {
    try {
      const response = await instance.get('/user/profile')
      const { data } = response
      
      return {
        success: true,
        user: data.user
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('accessToken')
    return !!token
  }

  /**
   * Handle API errors and format them consistently
   * @private
   * @param {Error} error - Axios error
   * @returns {ApiError}
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response
      return {
        success: false,
        message: data.message || `Request failed with status ${status}`,
        errors: data.errors || [],
        status
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        errors: ['NETWORK_ERROR']
      }
    } else {
      // Other error
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        errors: ['UNKNOWN_ERROR']
      }
    }
  }
}

// Export singleton instance
export default new AuthAPI()