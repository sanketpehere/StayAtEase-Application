import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stayatease_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('stayatease_user')
      localStorage.removeItem('stayatease_token')
      window.location.href = '/auth'
    }
    return Promise.reject(err)
  }
)

export default api