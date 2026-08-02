import { useState } from 'react'
import { Link } from 'react-router-dom'

type Kategori = 'semua' | 'pertunjukan' | 'lokakarya' | 'diskusi' | 'pameran'

const FILTERS: { key: Kategori; label: string; count: string }[] = [
  { key: 'semua', label: 'Semua', count: '12' },
  { key: 'pertunjukan', label: 'Pertunjukan', count: '04' },
  { key: 'lokakarya', label: 'Lokakarya', count: '05' },
  { key: 'diskusi', label: 'Diskusi', count: '02' },
  { key: 'pameran', label: 'Pameran', count: '01' },
]

const KEGIATAN = [
  {
    id: 1,
    tanggal: '04',
    bulan: 'April',
    jam: '10.00 WIB',
    kategori: 'lokakarya',
    label: 'Lokakarya',
    judul: 'Lokakarya Tatah Sungging',
    deskripsi: 'Belajar membuat wayang kulit dari awal — memahat, mewarnai, hingga menyungging — bersama pengrajin senior dari Sukoharjo.',
    kuota: '20 / 25',
  },
  {
    id: 2,
    tanggal: '22',
    bulan: 'April',
    jam: '15.30 WIB',
    kategori: 'diskusi',
    label: 'Diskusi',
    judul: 'Bincang Bersama Ki Dalang Muda',
    deskripsi: 'Diskusi terbuka tentang regenerasi seni pewayangan di tengah arus modernisasi. Bersama dalang-dalang muda dari Yogyakarta.',
    kuota: '42 / 80',
  },
  {
    id: 3,
    tanggal: '07',
    bulan: 'Mei',
    jam: '19.30 WIB',
    kategori: 'pameran',
    label: 'Pameran',
    judul: 'Pameran Khusus: Wayang Golek Sunda',
    deskripsi: 'Pameran selama dua minggu menampilkan 60 tokoh wayang golek terpilih dari Jawa Barat — beberapa untuk pertama kalinya.',
    kuota: 'Gratis',
  },
  {
    id: 4,
    tanggal: '21',
    bulan: 'Mei',
    jam: '09.00 WIB',
    kategori: 'lokakarya',
    label: 'Lokakarya',
    judul: 'Lokakarya Pengantar Karawitan',
    deskripsi: 'Mengenal gending pengiring pertunjukan wayang — dari ladrang hingga sampak. Terbuka untuk pemula.',
    kuota: '12 / 30',
  },
]

export default function Kegiatan() {
  const [activeFilter, setActiveFilter] = useState<Kategori>('semua')

  const filtered = KEGIATAN.filter(k =>
    activeFilter === 'semua' || k.kategori === activeFilter
  )

  return (
    <>
      {/* ── HEADER ── */}
      <section className="relative pt-32 md:pt-44 pb-20 px-8 md:px-20 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <span className="eyebrow reveal">Agenda &amp; Kegiatan</span>
          <h1 className="reveal font-display text-[clamp(40px,6vw,72px)] leading-[1.05] mt-4 text-cream" style={{ ['--rd' as string]: '100ms' }}>
            Kegiatan Museum
          </h1>
          <p className="reveal mt-6 max-w-xl text-cream/65 leading-[1.85]" style={{ ['--rd' as string]: '250ms' }}>
            Kabar dan agenda dari museum — pementasan, peminjaman wayang,
            lokakarya, sampai pameran. Semua kegiatan terbuka untuk umum
            kecuali disebutkan lain.
          </p>
        </div>
      </section>

      {/* ── FILTER ── */}
      <section className="sticky top-0 z-20 bg-ink/85 backdrop-blur-md border-b hairline px-8 md:px-20 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <span className="eyebrow !text-cream/40 mr-3 hidden md:inline">Kategori</span>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`chip${activeFilter === f.key ? ' is-active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-cream/45">
            <span className="text-gold">Akan datang</span>
            <span className="text-cream/20">·</span>
            <button className="hover:text-gold transition-colors">Arsip</button>
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENT ── */}
      <section className="px-8 md:px-20 py-20 md:py-28 border-b hairline">
        <div className="max-w-7xl mx-auto reveal">
          <p className="eyebrow mb-8">Kegiatan Terdekat</p>
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7">
              <div className="placeholder aspect-[16/10]">PAGELARAN SEMALAM SUNTUK</div>
            </div>
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-6 mb-6">
                  <span className="font-display text-gold text-7xl leading-none number-tabular">12</span>
                  <div>
                    <p className="font-display text-cream text-2xl leading-tight">Maret</p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gold/70">2026 · 19.00 WIB</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#A33' }}>● Pertunjukan</span>
                <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[1.05] text-cream mt-4">
                  Pagelaran Wayang Kulit Semalam Suntuk
                </h2>
                <p className="mt-6 text-cream/65 leading-[1.85]">
                  Pagelaran dengan lakon <em className="text-gold">"Banjaran Karna"</em>,
                  dibawakan oleh dalang tamu dan diiringi gamelan lengkap.
                </p>
              </div>
              <div className="mt-8 flex justify-between items-center border-t hairline pt-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-cream/50">Kampus II USD · Aula Driyarkara</p>
                <Link to="/kontak" className="arrow-link">Detail <span className="line" />→</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIST ── */}
      <section className="px-8 md:px-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-baseline mb-12">
            <span className="eyebrow">Agenda Mendatang</span>
            <p className="font-mono text-[10px] text-cream/40">{filtered.length} kegiatan</p>
          </div>

          <ul className="divide-y divide-gold/20 list-none m-0 p-0">
            {filtered.map(k => (
              <li key={k.id} className="reveal">
                <div className="grid md:grid-cols-12 gap-6 py-10 items-center">
                  <div className="md:col-span-2 flex md:flex-col items-baseline gap-3">
                    <span className="font-display text-gold text-6xl number-tabular leading-none">{k.tanggal}</span>
                    <div>
                      <p className="font-display text-cream text-xl leading-tight">{k.bulan}</p>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45">{k.jam}</p>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="placeholder aspect-[4/3] text-[9px]">{k.label.toUpperCase()} · {k.judul.toUpperCase()}</div>
                  </div>
                  <div className="md:col-span-5">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gold/70">{k.label}</span>
                    <h3 className="font-display text-3xl text-cream mt-2">{k.judul}</h3>
                    <p className="mt-3 text-cream/60 text-[14px] leading-relaxed line-clamp-2">{k.deskripsi}</p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45">
                      {k.kuota === 'Gratis' ? 'Tiket' : 'Kuota'}
                    </p>
                    <p className="font-display text-2xl text-cream mt-1">{k.kuota}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex justify-center">
            <button className="btn-ghost">Muat lebih banyak →</button>
          </div>
        </div>
      </section>

      <footer className="border-t hairline px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex justify-between text-[10px] uppercase tracking-[0.15em] text-cream/40">
          <span>© 2026 Museum Wayang USD</span>
          <Link to="/kontak" className="hover:text-gold transition-colors">Daftar untuk kegiatan</Link>
        </div>
      </footer>
    </>
  )
}
