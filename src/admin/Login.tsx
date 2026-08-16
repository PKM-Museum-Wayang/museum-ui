import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import slide1 from '../assets/loginsideimg.jpg'
import slide2 from '../assets/loginsideimg2.jpg'
import slide3 from '../assets/loginsideimg3.jpg'

const SLIDES = [
  { src: slide1, pan: 'kenburns-ltr' },
  { src: slide2, pan: 'kenburns-zoom' },
  { src: slide3, pan: 'kenburns-rtl' },
]

const SLIDE_INTERVAL_MS = 10000

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const set = (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('admin_token', res.data.data.token)
      navigate('/admin/dashboard')
    } catch {
      setError('Username atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#F5F5F5' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[650px] p-6 flex gap-6">
        <div className="w-1/2 rounded-2xl overflow-hidden relative">
          {SLIDES.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out"
              style={{
                opacity: i === activeSlide ? 1 : 0,
                animation: `${slide.pan} 14s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        <div className="w-1/2 flex flex-col justify-center px-6">
          <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Museum Wayang</h1>
          <p className="text-slate-400 text-sm mt-1">Dashboard Admin</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              placeholder="Username admin"
              required
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg border-none cursor-pointer transition-colors"
          >
            {loading ? 'Masuk…' : 'Masuk'}
          </button>
        </form>  
        </div>        
      </div>
    </div>
  )
}
