import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/') && window.location.pathname.startsWith('/admin')) {
    sessionStorage.removeItem('isLogin')
    sessionStorage.removeItem('adminId')
    window.location.assign('/admin/login')
  }
  return Promise.reject(error)
})

export const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default api