import AdminLoading from '../components/AdminLoading'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import api from '../lib/api'

export default function AuthOnly() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthorized' | 'error'>('loading')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    api.get('/auth/session', { signal: controller.signal }).then(res => {
      sessionStorage.setItem('adminId', String(res.data.data.admin.id))
      setStatus('authenticated')
    }).catch(err => {
      if (controller.signal.aborted) return
      setStatus(axios.isAxiosError(err) && err.response?.status === 401 ? 'unauthorized' : 'error')
    })
    return () => controller.abort()
  }, [retry])
  if (status === 'loading') return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600"><AdminLoading label="Memeriksa sesi..." /></div>
  if (status === 'unauthorized') return <Navigate to="/admin/login" replace />
  if (status === 'error') return <div>Gagal memeriksa sesi. <button onClick={() => { setStatus('loading'); setRetry(n => n + 1) }}>Coba lagi</button></div>
  return <Outlet />
}
