import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation'
import logo from '../assets/logo.png'

export default function Layout() {
  const { pathname } = useLocation()
  const [opening, setOpening] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setOpening(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  /* Scroll-reveal observer */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => observer.observe(el))
    }
    observeAll()

    // Elemen `.reveal` yang muncul belakangan (mis. setelah fetch API selesai)
    // tidak ter-observe oleh querySelectorAll di atas — MutationObserver menangkap itu.
    const mutationObserver = new MutationObserver(observeAll)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {opening && <div className="opening-screen" role="status" aria-live="polite">
        <div className="opening-screen-content">
          <div className="opening-screen-emblem"><img src={logo} alt="" className="opening-screen-logo" /></div>
          <p className="opening-screen-kicker">Koleksi Wayang</p>
          <p className="opening-screen-title">Sutarwin</p>
          <p className="opening-screen-caption">Merawat warisan, melanjutkan cerita.</p>
          <div className="opening-screen-progress" aria-hidden="true"><span /></div>
          <span className="opening-screen-label">Memuat halaman...</span>
        </div>
      </div>}
      <div className="bg-ink text-cream min-h-screen" inert={opening} aria-hidden={opening || undefined}>
        <Navigation />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </>
  )
}
