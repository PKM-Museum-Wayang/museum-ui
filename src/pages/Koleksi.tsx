import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

/* ── Types ── */
interface KoleksiItem {
  id: number
  nama: string
  jenis: string
  gambar?: string
}

/* ── Mock data — ganti dengan fetch ke API saat backend siap ── */
const MOCK_KOLEKSI: KoleksiItem[] = [
  { id: 1, nama: 'Arjuna', jenis: 'Wayang Kulit' },
  { id: 2, nama: 'Bima', jenis: 'Wayang Kulit' },
  { id: 3, nama: 'Kresna', jenis: 'Wayang Kulit' },
  { id: 4, nama: 'Srikandi', jenis: 'Wayang Kulit' },
  { id: 5, nama: 'Gatotkaca', jenis: 'Wayang Kulit' },
  { id: 6, nama: 'Nakula', jenis: 'Wayang Kulit' },
  { id: 7, nama: 'Sadewa', jenis: 'Wayang Kulit' },
  { id: 8, nama: 'Cepot', jenis: 'Wayang Golek' },
  { id: 9, nama: 'Dawala', jenis: 'Wayang Golek' },
  { id: 10, nama: 'Bagong', jenis: 'Wayang Golek' },
  { id: 11, nama: 'Rahwana', jenis: 'Wayang Kulit' },
  { id: 12, nama: 'Hanoman', jenis: 'Wayang Kulit' },
]

const JENIS_LIST = ['Wayang Kulit', 'Wayang Golek', 'Wayang Klitik', 'Wayang Bali', 'Wayang Lombok']

export default function Koleksi() {
  const [search, setSearch] = useState('')
  const [activeJenis, setActiveJenis] = useState('')

  const filtered = MOCK_KOLEKSI.filter(k => {
    const matchJenis = !activeJenis || k.jenis === activeJenis
    const matchSearch = !search || k.nama.toLowerCase().includes(search.toLowerCase())
    return matchJenis && matchSearch
  })

  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="page-hero px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl reveal">
            <h1 className="font-display text-cream text-[clamp(40px,6vw,72px)] leading-[1.05] mt-5">
              Koleksi Wayang
            </h1>
            <p className="mt-6 max-w-xl text-cream/65 leading-[1.85]">
              Koleksi wayang milik Bapak Sutarwinarno yang tersimpan dalam
              sembilan kotak penyimpanan. Telusuri tokoh-tokohnya dan baca
              cerita di balik setiap wayang.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="px-8 md:px-20 py-12 border-b hairline">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.15em] list-none m-0 p-0">
            <li>
              <button
                className={`${!activeJenis ? 'text-gold border-b border-gold pb-1' : 'text-cream/55 hover:text-gold transition-colors'}`}
                onClick={() => setActiveJenis('')}
              >
                Semua
              </button>
            </li>
            {JENIS_LIST.map(j => (
              <li key={j}>
                <button
                  className={`${activeJenis === j ? 'text-gold border-b border-gold pb-1' : 'text-cream/55 hover:text-gold transition-colors'}`}
                  onClick={() => setActiveJenis(j)}
                >
                  {j}
                </button>
              </li>
            ))}
          </ul>

          {/* Search */}
          <div className="flex items-center gap-3 border hairline px-4 py-2 min-w-[260px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gold/70 shrink-0">
              <circle cx="6" cy="6" r="5" stroke="currentColor" />
              <path d="M10 10l3 3" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <input
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-cream/35 text-cream"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama tokoh — mis. Arjuna"
            />
          </div>
        </div>
      </section>

      {/* ── COLLECTION GRID ── */}
      <section className="px-8 md:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <p className="eyebrow">Daftar Koleksi</p>
            <p className="font-mono text-[10px] text-cream/45 uppercase tracking-[0.15em]">
              {filtered.length} koleksi
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-cream/40">Koleksi tidak ditemukan.</p>
              <button
                onClick={() => { setSearch(''); setActiveJenis('') }}
                className="mt-6 inline-block text-[11px] uppercase tracking-[0.15em] text-gold hover:underline"
              >
                Lihat semua koleksi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((k, idx) => (
                <Link
                  key={k.id}
                  to={`/koleksi/${k.id}`}
                  className="group block lift border hairline p-3 reveal"
                  style={{ ['--rd' as string]: `${(idx % 4) * 80}ms` }}
                >
                  {k.gambar ? (
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={k.gambar}
                        alt={k.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  ) : (
                    <div className="placeholder aspect-[3/4]">{k.nama.toUpperCase()}</div>
                  )}
                  <div className="mt-4 px-1">
                    <h4 className="font-display text-xl text-cream group-hover:text-gold transition-colors">{k.nama}</h4>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45 mt-1">{k.jenis}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
