import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import api, { BASE_URL } from '../lib/api'

/* ── Types ── */
interface MediaWayang {
  id: number
  jenis: 'IMAGE' | 'VIDEO'
  fileUrl: string
}

interface WayangApi {
  id: number
  nama: string
  golonganId: number
  media: MediaWayang[]
}

interface Golongan {
  id: number
  namaGolongan: string
  tipeGolongan: string
}

interface KoleksiItem {
  id: number
  nama: string
  tipeGolongan: string
  gambar?: string
}

const TIPE_GOLONGAN_LIST = [
  { value: 'SIMPINGAN_KIRI', label: 'Simpingan Kiri' },
  { value: 'SIMPINGAN_KANAN', label: 'Simpingan Kanan' },
  { value: 'DUDHAHAN', label: 'Dudhahan' },
]

const tipeGolonganLabel = (tipe: string) =>
  TIPE_GOLONGAN_LIST.find(t => t.value === tipe)?.label ?? tipe

export default function Koleksi() {
  const [koleksi, setKoleksi] = useState<KoleksiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTipe, setActiveTipe] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/wayang?limit=100'),
      api.get('/golongan'),
    ])
      .then(([wayangRes, golonganRes]) => {
        const wayangList: WayangApi[] = wayangRes.data.data.data
        const golonganList: Golongan[] = golonganRes.data.data
        const golonganMap = new Map(golonganList.map(g => [g.id, g]))

        setKoleksi(wayangList.map(w => {
          const gambarMedia = w.media.find(m => m.jenis === 'IMAGE')
          return {
            id: w.id,
            nama: w.nama,
            tipeGolongan: golonganMap.get(w.golonganId)?.tipeGolongan ?? '',
            gambar: gambarMedia ? `${BASE_URL}${gambarMedia.fileUrl}` : undefined,
          }
        }))
      })
      .catch(() => setKoleksi([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = koleksi.filter(k => {
    const matchTipe = !activeTipe || k.tipeGolongan === activeTipe
    const matchSearch = !search || k.nama.toLowerCase().includes(search.toLowerCase())
    return matchTipe && matchSearch
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
                className={`${!activeTipe ? 'text-gold border-b border-gold pb-1' : 'text-cream/55 hover:text-gold transition-colors'}`}
                onClick={() => setActiveTipe('')}
              >
                Semua
              </button>
            </li>
            {TIPE_GOLONGAN_LIST.map(t => (
              <li key={t.value}>
                <button
                  className={`${activeTipe === t.value ? 'text-gold border-b border-gold pb-1' : 'text-cream/55 hover:text-gold transition-colors'}`}
                  onClick={() => setActiveTipe(t.value)}
                >
                  {t.label}
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

          {loading ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-cream/40">Memuat koleksi…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-cream/40">Koleksi tidak ditemukan.</p>
              <button
                onClick={() => { setSearch(''); setActiveTipe('') }}
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
                    <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45 mt-1">{tipeGolonganLabel(k.tipeGolongan)}</p>
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