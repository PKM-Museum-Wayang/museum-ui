import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

// Tema disimpan di localStorage dan diterapkan sebagai atribut
// data-theme di <html> (nilai awal di-set oleh script inline index.html
// agar tidak flash saat load).
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
