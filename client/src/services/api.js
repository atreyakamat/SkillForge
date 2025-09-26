import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
let bearerToken = null
let isRefreshing = false
let pendingQueue = []

const instance = axios.create({ baseURL: BASE_URL, withCredentials: false, timeout: 20000 })

// Dev logging
instance.interceptors.request.use((config) => {
  if (bearerToken) config.headers.Authorization = `Bearer ${bearerToken}`
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[API] →', config.method?.toUpperCase(), config.url, config.params || config.data)
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[API] ←', response.status, response.config.url, response.data)
    }
    return response
  },
  async (error) => {
    const status = error?.response?.status
    const original = error.config || {}

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[API] ×', status, original?.url, error?.response?.data || error.message)
    }

    // Network errors: simple retry once
    if (!error.response) {
      original.__retryCount = original.__retryCount || 0
      if (original.__retryCount < 1) {
        original.__retryCount++
        return instance(original)
      }
    }

    // 401: try token refresh once
    if (status === 401 && !original.__isRetryRequest && bearerToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return instance(original)
        })
      }

      original.__isRetryRequest = true
      isRefreshing = true
      try {
        const newToken = await refreshToken()
        bearerToken = newToken
        pendingQueue.forEach(p => p.resolve(newToken))
        pendingQueue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return instance(original)
      } catch (e) {
        pendingQueue.forEach(p => p.reject(e))
        pendingQueue = []
        bearerToken = null
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export function setToken(token) { bearerToken = token }

async function refreshToken() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/refresh`)
    const token = res?.data?.token || res?.data?.data?.token
    if (!token) throw new Error('No token in refresh response')
    return token
  } catch (err) {
    throw err
  }
}

// Endpoint groups
export const authAPI = {
  async login(payload) {
    const { data } = await instance.post('/auth/login', payload)
    return shape(data)
  },
  async register(payload) {
    const { data } = await instance.post('/auth/register', payload)
    return shape(data)
  },
  async logout() {
    const { data } = await instance.post('/auth/logout')
    return shape(data)
  },
  async refresh() {
    const { data } = await instance.post('/auth/refresh')
    return shape(data)
  }
}

export const skillAPI = {
  async getUserSkills() {
    const { data } = await instance.get('/skills')
    return shape(data)
  },
  async addSkill(payload) {
    const { data } = await instance.post('/skills', payload)
    return shape(data)
  },
  async updateSkill(id, payload) {
    const { data } = await instance.put(`/skills/${id}`, payload)
    return shape(data)
  },
  async deleteSkill(id) {
    const { data } = await instance.delete(`/skills/${id}`)
    return shape(data)
  }
}

export const peerAPI = {
  async requestReview(payload) {
    const { data } = await instance.post('/peer/request', payload)
    return shape(data)
  },
  async submitReviewForRequest(requestId, payload) {
    const { data } = await instance.post(`/peer/submit/${requestId}`, payload)
    return shape(data)
  },
  async getPending() {
    const { data } = await instance.get('/peer/pending')
    return shape(data)
  },
  async getReceived() {
    const { data } = await instance.get('/peer/received')
    return shape(data)
  },
  async getReviewHistory(userId) {
    const { data } = await instance.get(`/peer/history/${userId}`)
    return shape(data)
  },
  async rateReviewQuality(reviewId, payload) {
    const { data } = await instance.put(`/peer/quality/${reviewId}`, payload)
    return shape(data)
  },
  async recommendReviewers(payload) {
    const { data } = await instance.post('/peer/recommend', payload)
    return shape(data)
  }
}

export const analyticsAPI = {
  async getGapAnalysis(userId) {
    const { data } = await instance.get(`/analytics/gaps/${userId}`)
    return shape(data)
  },
  async getJobMatches(userId) {
    const { data } = await instance.get(`/analytics/jobs/matches/${userId}`)
    return shape(data)
  },
  async getBenchmarks(industry) {
    const { data } = await instance.get(`/analytics/benchmarks/${encodeURIComponent(industry)}`)
    return shape(data)
  },
  async getSkillTrends(skillName) {
    const { data } = await instance.get(`/analytics/trends/${encodeURIComponent(skillName)}`)
    return shape(data)
  }
}

// Helpers
function shape(resData) {
  // Accept either { success, data, message } or raw payloads
  if (resData && typeof resData === 'object' && 'success' in resData) {
    return resData
  }
  return { success: true, data: resData, message: '' }
}

const api = { setToken, instance }
export default api

