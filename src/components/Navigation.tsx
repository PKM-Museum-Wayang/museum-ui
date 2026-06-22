import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/kegiatan', label: 'Kegiatan' },
  { to: '/koleksi', label: 'Koleksi' },
  { to: '/tentang', label: 'Tentang Kami' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <nav className={`museum-nav fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="museum-nav-logo">wayang</NavLink>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `museum-nav-link${isActive ? ' active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          {/* <button
            className={`museum-hamburger md:hidden${mobileOpen ? ' active' : ''}`}
            aria-label="Buka menu"
            onClick={() => setMobileOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button> */}
        </div>
      </nav>

      {/* Mobile panel */}
      <div className={`museum-mobile-nav md:hidden${mobileOpen ? ' open' : ''}`}>
        <ul className="flex flex-col items-center gap-8 text-[0.95rem] list-none m-0 p-0">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `museum-nav-link${isActive ? ' active' : ''}`
                }
                onClick={closeMobile}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
