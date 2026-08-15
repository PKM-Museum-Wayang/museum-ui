import {useState} from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'

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
    to: '/admin/cerita',
    label: 'Cerita',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen font-sans bg-slate-100 text-slate-800">
      {/* ── Sidebar ── */}
      <aside
        className={`${collapsed ? 'w-[72px]' : 'w-[260px]'} fixed top-0 left-0 bottom-0 z-50 flex flex-col py-8 transition-all duration-300`}
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >

        <button onClick={() => setCollapsed(v => !v)} className='absolute -right-3 top-8 w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 border border-white/10 text-white cursor-pointer'>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={collapsed ? 'rotate-180' : ''}>
              <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Brand */}
        <div className="px-6 pb-8 border-b border-white/10 mb-6">
          {!collapsed && (
            <>
              <h2 className="text-white font-bold text-xl">Museum Wayang</h2>
              <span className="text-slate-400 text-xs mt-1 block">Dashboard Admin</span>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1">
          <ul className="list-none m-0 p-0">
            {sidebarLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-[0.85rem] text-[0.9rem] no-underline border-l-[3px] transition-all ${
                      isActive
                        ? 'bg-white/5 text-white border-blue-500'
                        : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {icon}
                  {!collapsed && label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 pt-6 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 text-[0.85rem] no-underline hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {!collapsed && (
              <>
              <span>Kembali ke Website</span>
              </>
            )}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={`flex-1 ${collapsed ? 'ml-[72px]': 'ml-[260px]'} min-h-screen p-8 transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  )
}
