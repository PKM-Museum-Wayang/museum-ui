import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import api, { BASE_URL } from '../lib/api'
import CollectionPhoto from '../components/CollectionPhoto'

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
  golongan: { tipeGolongan: string }
  media: MediaWayang[]
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

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)
    api.get('/wayang', { params: { page, limit: 24, search, tipeGolongan: activeTipe }, signal: controller.signal })
      .then(res => {
        const result = res.data.data
        setTotal(result.pagination.total)
        setTotalPages(result.pagination.totalPages)
        setKoleksi(result.data.map((w: WayangApi) => ({
          id: w.id, nama: w.nama, tipeGolongan: w.golongan.tipeGolongan,
          gambar: w.media.find(m => m.jenis === 'IMAGE')?.fileUrl,
        })).map((w: KoleksiItem) => ({ ...w, gambar: w.gambar ? `${BASE_URL}${w.gambar}` : undefined })))
      })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [page, search, activeTipe, retry])
  const filtered = koleksi

  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="relative min-h-[40svh] md:min-h-[65vh] flex flex-col items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
      style={{ backgroundImage: "url('/bg.JPG')"}}>
      </div>
      <div className="absolute inset-0 z-10 hero-overlay" />
       <div className="relative z-20 text-center px-8 animate-[fadeInUp_1s_ease_0.3s_both]">
          {/* <p className="eyebrow mb-6">Koleksi Wayang</p> */}
          <h1 className="font-display text-[clamp(36px,10vw,48px)] md:text-[clamp(48px,8vw,104px)] leading-[1] text-cream">
            Koleksi
          </h1>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="px-5 sm:px-8 md:px-20 py-8 md:py-12 border-b hairline">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs uppercase tracking-[0.15em] list-none m-0 p-0">
            <li>
              <button
                aria-pressed={!activeTipe}
                className={`min-h-11 ${!activeTipe ? 'text-gold border-b border-gold pb-1' : 'text-cream/55 hover:text-gold transition-colors'}`}
                onClick={() => { setActiveTipe(''); setPage(1) }}
              >
                Semua
              </button>
            </li>
            {TIPE_GOLONGAN_LIST.map(t => (
              <li key={t.value}>
                <button
                  aria-pressed={activeTipe === t.value}
                  className={`min-h-11 ${activeTipe === t.value ? 'text-gold border-b border-gold pb-1' : 'text-cream/55 hover:text-gold transition-colors'}`}
                  onClick={() => { setActiveTipe(t.value); setPage(1) }}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Search */}
          <div className="flex items-center gap-3 border hairline px-4 py-2 w-full min-w-0 md:w-auto md:min-w-[240px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gold/70 shrink-0">
              <circle cx="6" cy="6" r="5" stroke="currentColor" />
              <path d="M10 10l3 3" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <input
              aria-label="Cari nama koleksi"
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-cream/65 text-cream"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Cari nama tokoh — mis. Arjuna"
            />
          </div>
        </div>
      </section>

      {/* ── COLLECTION GRID ── */}
      <section className="px-5 sm:px-8 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <p className="eyebrow">Daftar Koleksi</p>
            <p className="font-mono text-xs text-cream/65 uppercase tracking-[0.15em]">
              {total} koleksi
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 md:py-24">
              <p className="font-display text-2xl text-cream/65">Memuat koleksi…</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 md:py-24"><p>Gagal memuat koleksi.</p><button className="btn-ghost mt-6" onClick={() => setRetry(n => n + 1)}>Coba lagi</button></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p className="font-display text-2xl text-cream/75">{search || activeTipe ? 'Koleksi tidak ditemukan.' : 'Belum ada koleksi yang ditampilkan.'}</p>
              {(search || activeTipe) && <button
                onClick={() => { setSearch(''); setActiveTipe(''); setPage(1) }}
                className="mt-6 inline-block text-xs uppercase tracking-[0.15em] text-gold hover:underline"
              >
                Lihat semua koleksi
              </button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filtered.map((k, idx) => (
                <Link
                  key={k.id}
                  to={`/koleksi/${k.id}`}
                  className="group block lift border hairline p-3 reveal"
                  style={{ ['--rd' as string]: `${(idx % 4) * 80}ms` }}
                >
                  <CollectionPhoto key={k.gambar} src={k.gambar} name={k.nama} />
                  <div className="mt-4 px-1">
                    <h4 className="font-display text-lg md:text-xl text-cream group-hover:text-gold transition-colors">{k.nama}</h4>
                    <p className="text-xs uppercase tracking-[0.15em] text-cream/65 mt-1">{tipeGolonganLabel(k.tipeGolongan)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && !error && totalPages > 1 && <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-10">
            <button className="btn-ghost disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</button>
            <span>Halaman {page} dari {totalPages}</span>
            <button className="btn-ghost disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Berikutnya</button>
          </div>}
        </div>
      </section>

      <Footer />
    </>
  )
}
