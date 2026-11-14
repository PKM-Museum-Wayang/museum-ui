import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { biografiApi, type Biografi } from '../lib/biografi'

interface FooterProps {
  variant?: 'full' | 'minimal'
}

export default function Footer({ variant = 'full' }: FooterProps) {
  const [profile, setProfile] = useState<Biografi | null>(null)

  useEffect(() => {
    if (variant !== 'full') return
    const controller = new AbortController()
    biografiApi.get(controller.signal).then(setProfile).catch(() => {})
    return () => controller.abort()
  }, [variant])

  if (variant === 'minimal') {
    return (
      <footer className="border-t hairline px-5 sm:px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between text-xs uppercase tracking-[0.15em] text-cream/65">
          <span>© 2026 Koleksi Wayang Sutarwin</span>
          <Link to="/kontak" className="hover:text-gold transition-colors">Hubungi Kami</Link>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t hairline px-5 sm:px-8 md:px-20 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">
        <div className="lg:col-span-5">
          <p className="font-display text-3xl text-cream">
            Koleksi Wayang <em className="text-gold not-italic">Sutarwin</em>
          </p>
          <p className="text-cream/70 text-sm mt-3 max-w-xs leading-relaxed">
            Merawat warisan, melanjutkan cerita.
          </p>
        </div>
        <div className="lg:col-span-2">
          <p className="eyebrow mb-4">Jelajah</p>
          <ul className="space-y-2 text-sm text-cream/70 list-none m-0 p-0">
            <li><Link to="/kegiatan" className="hover:text-gold transition-colors">Kegiatan</Link></li>
            <li><Link to="/koleksi" className="hover:text-gold transition-colors">Koleksi</Link></li>
            <li><Link to="/tentang" className="hover:text-gold transition-colors">Tentang Kami</Link></li>
            <li><Link to="/kontak" className="hover:text-gold transition-colors">Kontak</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="eyebrow mb-4">Sosial</p>
          <ul className="space-y-2 text-sm text-cream/70 list-none m-0 p-0">
            {([['Instagram', profile?.instagram], ['Facebook', profile?.facebook], ['YouTube', profile?.youtube]] as const)
              .filter(([, url]) => url)
              .map(([label, url]) => <li key={label}><a href={url!} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">{label}</a></li>)}
            {!profile?.instagram && !profile?.facebook && !profile?.youtube && <li><Link to="/kontak" className="hover:text-gold transition-colors">Informasi kontak</Link></li>}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="eyebrow mb-4">Kunjungi</p>
          <p className="text-sm text-cream/70 leading-relaxed">
            {profile?.alamat || <>Informasi kunjungan tersedia di <Link to="/kontak" className="hover:text-gold transition-colors underline">halaman kontak</Link>.</>}
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t hairline flex flex-col md:flex-row justify-between text-xs uppercase tracking-[0.15em] text-cream/65 gap-3">
        <span>© 2026 Koleksi Wayang Sutarwin</span>
        <span>Dikembangkan oleh tim PKM Universitas Sanata Dharma</span>
      </div>
    </footer>
  )
}
