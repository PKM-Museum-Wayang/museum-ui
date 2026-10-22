import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'


const sidebarLinks = [
  {
    to: '/admin/dashboard',
    label: 'Wayang',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/admin/golongan',
    label: 'Golongan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
  <polygon points="12 2 2 7 12 12 22 7 12 2" />
  <polyline points="2 17 12 22 22 17" />
  <polyline points="2 12 12 17 22 12" />
</svg>
    ),
  },

  {
    to: '/admin/kegiatan',
    label: 'Kegiatan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },

  {
    to: '/admin/penyimpanan',
    label: 'Penyimpanan',
    icon: (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
  <path d="m3.3 7 8.7 5 8.7-5" />
  <path d="M12 22V12" />
</svg>
    ),
  },
  {
    to: '/admin/peminjaman',
    label: 'Peminjaman',
    icon: (
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="w-5 h-5 shrink-0"
>
  <rect x="4" y="3" width="16" height="18" rx="2" />
  <path d="M9 3V2h6v1" />
  <path d="M8 8h8" />
  <path d="M8 12h5" />
  <path d="M8 16h3" />
  <path d="M16 12v5" />
  <path d="m13.5 14.5 2.5 2.5 2.5-2.5" />
</svg>
    ),
  }
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
const navigate = useNavigate()

const handleLogout = async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    // Tetap logout dari sisi React meskipun request gagal
  } finally {
    sessionStorage.removeItem('isLogin')
    navigate('/admin/login', { replace: true })
  }
}
  return (
    <div className="flex min-h-screen font-sans bg-slate-100 text-slate-800">

      {/* ── Overlay (mobile, saat drawer terbuka) ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ── Topbar (mobile saja) ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 border-none text-white cursor-pointer flex-shrink-0"
          aria-label="Buka menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="font-bold text-sm">Museum Wayang</span>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`${collapsed ? 'md:w-[72px]' : 'md:w-[260px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-[260px] fixed top-0 left-0 bottom-0 z-50 flex flex-col py-8 transition-all duration-300`}
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >

        <button onClick={() => setCollapsed(v => !v)} className='hidden md:flex absolute -right-3 top-8 w-6 h-6 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-white cursor-pointer'>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={collapsed ? 'rotate-180' : ''}>
              <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border-none text-white cursor-pointer"
          aria-label="Tutup menu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand */}
        <div className="px-6 pb-8 border-b border-white/10 mb-6">
          {(!collapsed || mobileOpen) && (
            <>
              <h2 className="text-white font-bold text-xl">Museum Wayang</h2>
              <span className="text-slate-400 text-xs mt-1 block">Dashboard Admin</span>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="list-none m-0 p-0">
            {sidebarLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-[0.85rem] text-[0.9rem] no-underline border-l-[3px] transition-all ${
                      isActive
                        ? 'bg-white/5 text-white border-blue-500'
                        : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {icon}
                  {(!collapsed || mobileOpen) && label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
       {/* Footer */}
<div className="px-6 pt-6 border-t border-white/10 space-y-4">

 

  {/* Logout */}
  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-2 text-red-400 text-[0.85rem] bg-transparent border-none cursor-pointer hover:text-red-300 transition-colors p-0"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>

    {(!collapsed || mobileOpen) && (
      <span>Logout</span>
    )}
  </button>
   {/* Kembali ke Website */}
  <Link
    to="/"
    className="flex items-center gap-2 text-slate-400 text-[0.85rem] no-underline hover:text-white transition-colors"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>

    {(!collapsed || mobileOpen) && (
      <span>Kembali ke Website</span>
    )}
  </Link>

</div>
      </aside>

      {/* ── Main ── */}
      <main className={`flex-1 ml-0 ${collapsed ? 'md:ml-[72px]': 'md:ml-[260px]'} min-h-screen pt-20 px-4 pb-6 md:p-8 transition-all duration-300 overflow-x-hidden`}>
        <Outlet />
      </main>
    </div>
  )
}
