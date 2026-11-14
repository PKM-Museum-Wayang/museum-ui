import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import api, { BASE_URL } from '../lib/api'

interface KegiatanDetailItem {
  id: number
  nama: string
  deskripsi?: string | null
  tanggal: string
  lokasi: string
  gambar: {
    id: number,
    fileUrl: string
  }[]
}

export default function KegiatanDetail() {
  const { id } = useParams()
  const [kegiatan, setKegiatan] = useState<KegiatanDetailItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setError(false)

    api.get(`/kegiatan/${id}`)
      .then(res => setKegiatan({ ...res.data.data, gambar: res.data.data.gambar ?? [] }))
      .catch(err => { if (axios.isAxiosError(err) && err.response?.status === 404) setNotFound(true); else setError(true) })
      .finally(() => setLoading(false))
  }, [id, retry])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-cream/65">Memuat…</div>
  }

  if (error) return <div className="min-h-screen flex flex-col items-center justify-center"><p>Gagal memuat kegiatan.</p><button className="btn-ghost mt-6" onClick={() => setRetry(n => n + 1)}>Coba lagi</button></div>

  if (notFound || !kegiatan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl text-cream/65">Kegiatan tidak ditemukan.</p>
        <Link to="/kegiatan" className="btn-ghost mt-8">← Kembali ke Kegiatan</Link>
      </div>
    )
  }

  const waktu = new Date(kegiatan.tanggal)

  const tanggalLabel = waktu.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const jamLabel = waktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* ── BREADCRUMB ── */}
      <div className="px-5 sm:px-8 md:px-20 pt-20 md:pt-36 pb-6 text-xs uppercase tracking-[0.15em] text-cream/65 flex gap-3 items-center flex-wrap">
        <Link to="/kegiatan" className="hover:text-gold transition-colors">Kegiatan</Link>
        <span className="text-gold/40">/</span>
        <span className="text-gold">{kegiatan.nama}</span>
      </div>

      {/* ── HERO ── */}
      <section className="px-5 sm:px-8 md:px-20 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 md:gap-16">

          {/* Gambar */}
          <div className="md:col-span-7 reveal">
            {kegiatan.gambar.length > 0 ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={`${BASE_URL}${kegiatan.gambar[activeSlide].fileUrl}`}
                  alt={kegiatan.nama}
                  className="w-full h-full object-cover"
                />

                {kegiatan.gambar.length > 1 && (
                  <>
                  <button type='button' aria-label="Gambar sebelumnya" onClick={() => setActiveSlide(prev => (prev - 1 + kegiatan.gambar.length) % kegiatan.gambar.length)}
                    className='absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-ink/80 text-cream border-none cursor-pointer'
                    >
                      ←
                    </button>

                  <button type='button' aria-label="Gambar berikutnya" onClick={() => setActiveSlide(prev => (prev + 1) % kegiatan.gambar.length)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-ink/80 text-cream border-none cursor-pointer'
                    >
                      →
                    </button>

                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex'>
                      {kegiatan.gambar.map((_, idx) => (
                        <button key={idx} type="button" onClick={() => setActiveSlide(idx)}
                          aria-label={`Tampilkan gambar ${idx + 1}`}
                          aria-pressed={idx === activeSlide}
                          className="w-11 h-11 flex items-center justify-center border-none cursor-pointer bg-transparent p-0">
                          <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full ${idx === activeSlide ? 'bg-gold' : 'bg-white/70'}`} />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="placeholder aspect-[4/3]">{kegiatan.nama.toUpperCase()}</div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <span className="eyebrow">Detail Kegiatan</span>

            <h1 className="font-display text-[clamp(32px,5vw,56px)] text-cream leading-[1.05] mt-4">
              {kegiatan.nama}
            </h1>

            <dl className="mt-10 space-y-5">
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-xs uppercase tracking-[0.15em] text-gold/70">Tanggal</dt>
                <dd className="col-span-2 text-cream/85">{tanggalLabel}</dd>
              </div>
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-xs uppercase tracking-[0.15em] text-gold/70">Jam</dt>
                <dd className="col-span-2 text-cream/85">{jamLabel} WIB</dd>
              </div>
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-xs uppercase tracking-[0.15em] text-gold/70">Lokasi</dt>
                <dd className="col-span-2 text-cream/85">{kegiatan.lokasi}</dd>
              </div>
            </dl>

            {kegiatan.deskripsi && (
              <p className="mt-10 text-cream/70 leading-[1.85] text-[15px]">{kegiatan.deskripsi}</p>
            )}

            <div className="mt-12 flex gap-4 flex-wrap">
              <Link to="/kegiatan" className="btn-ghost">← Kembali ke Kegiatan</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="minimal" />
    </>
  )
}
