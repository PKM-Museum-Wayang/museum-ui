import { Link } from 'react-router-dom'

interface FooterProps {
  variant?: 'full' | 'minimal'
}

export default function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className="border-t hairline px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex justify-between text-[10px] uppercase tracking-[0.3em] text-cream/40">
          <span>© MMXXVI · Museum Wayang USD</span>
          <Link to="/kontak" className="hover:text-gold transition-colors">Hubungi Kami</Link>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t hairline px-8 md:px-20 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="font-display text-3xl text-cream">
            Museum <em className="text-gold not-italic">Wayang</em>
          </p>
          <p className="text-cream/50 text-sm mt-3 max-w-xs leading-relaxed">
            Universitas Sanata Dharma — merawat warisan, melanjutkan cerita.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-4">Jelajah</p>
          <ul className="space-y-2 text-sm text-cream/70 list-none m-0 p-0">
            <li><Link to="/kegiatan" className="hover:text-gold transition-colors">Kegiatan</Link></li>
            <li><Link to="/koleksi" className="hover:text-gold transition-colors">Koleksi</Link></li>
            <li><Link to="/tentang" className="hover:text-gold transition-colors">Tentang Kami</Link></li>
            <li><Link to="/kontak" className="hover:text-gold transition-colors">Kontak</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-4">Sosial</p>
          <ul className="space-y-2 text-sm text-cream/70 list-none m-0 p-0">
            <li><a href="#" className="hover:text-gold transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">YouTube</a></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-4">Kunjungi</p>
          <p className="text-sm text-cream/70 leading-relaxed">
            Kampus II USD, Mrican<br />Yogyakarta · 55281
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t hairline flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-[0.3em] text-cream/40 gap-3">
        <span>© MMXXVI · Museum Wayang USD</span>
        <span>Dirancang untuk warisan, dengan kehormatan.</span>
      </div>
    </footer>
  )
}
