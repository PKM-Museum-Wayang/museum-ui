import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation'

export default function Layout() {
  const { pathname } = useLocation()

  /* Scroll-reveal observer */
  useEffect(() => {
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
    const targets = document.querySelectorAll('.reveal')
    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="bg-ink text-cream min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
