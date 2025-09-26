import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: false
})

let bearerToken = null

instance.interceptors.request.use((config) => {
  if (bearerToken) {
    config.headers.Authorization = `Bearer ${bearerToken}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // Optionally emit a global event or handle logout here
      // eslint-disable-next-line no-console
      console.warn('Unauthorized - clearing token')
      bearerToken = null
    }
    return Promise.reject(error)
  }
)

export default {
  setToken: (token) => { bearerToken = token },
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config)
}

