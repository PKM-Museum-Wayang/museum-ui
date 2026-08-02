import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Accept': 'application/json' },
})

// Sertakan JWT token di setiap request kalau ada
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default api
