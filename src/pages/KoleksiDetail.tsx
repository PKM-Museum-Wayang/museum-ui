import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import api, { BASE_URL } from '../lib/api'

const TIPE_GOLONGAN_LABEL: Record<string, string> = {
  SIMPINGAN_KIRI: 'Simpingan Kiri',
  SIMPINGAN_KANAN: 'Simpingan Kanan',
  DUDHAHAN: 'Dudhahan',
}

interface MediaWayang {
  id: number
  jenis: 'IMAGE' | 'VIDEO'
  fileUrl: string
}

interface WayangDetail {
  id: number
  noWayang: string
  nama: string
  daerah?: string
  deskripsi?: string
  cerita?: string
  kondisi?: string
  golonganId: number
  golongan: { id: number; namaGolongan: string; tipeGolongan: string }
  media: MediaWayang[]
}

interface RelatedItem {
  id: number
  nama: string
  tipeGolongan: string
}

export default function KoleksiDetail() {
  const { id } = useParams()
  const [koleksi, setKoleksi] = useState<WayangDetail | null>(null)
  const [related, setRelated] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)

    api.get(`/wayang/${id}`)
      .then(res => {
        const w: WayangDetail = res.data.data
        setKoleksi(w)

        // Koleksi terkait: golongan yang sama, kecuali dirinya sendiri
        return api.get(`/wayang?golonganId=${w.golonganId}&limit=4`)
          .then(relRes => {
            const list = relRes.data.data.data as { id: number; nama: string }[]
            setRelated(
              list
                .filter(item => item.id !== w.id)
                .slice(0, 3)
                .map(item => ({ id: item.id, nama: item.nama, tipeGolongan: w.golongan.tipeGolongan }))
            )
          })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-cream/40">Memuat…</div>
  }

  if (notFound || !koleksi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl text-cream/40">Koleksi tidak ditemukan.</p>
        <Link to="/koleksi" className="btn-ghost mt-8">← Kembali ke Koleksi</Link>
      </div>
    )
  }

  const tipeLabel = TIPE_GOLONGAN_LABEL[koleksi.golongan.tipeGolongan] ?? koleksi.golongan.tipeGolongan
  const gambar = koleksi.media.find(m => m.jenis === 'IMAGE')

  return (
    <>
      {/* ── BREADCRUMB ── */}
      <div className="px-8 md:px-20 pt-32 md:pt-36 pb-6 text-[11px] uppercase tracking-[0.15em] text-cream/45 flex gap-3 items-center flex-wrap">
        <Link to="/koleksi" className="hover:text-gold transition-colors">Koleksi</Link>
        <span className="text-gold/40">/</span>
        <span className="text-gold">{koleksi.nama}</span>
      </div>

      {/* ── HERO ── */}
      <section className="px-8 md:px-20 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">
          {/* Gallery */}
          <div className="md:col-span-7 reveal">
            {gambar ? (
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={`${BASE_URL}${gambar.fileUrl}`}
                  alt={koleksi.nama}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="placeholder aspect-[4/5]">{koleksi.nama.toUpperCase()}</div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <span className="eyebrow">Detail Koleksi</span>

            <h1 className="font-display text-[clamp(40px,6vw,72px)] text-cream leading-[1.05] mt-4">
              {koleksi.nama}
            </h1>
            <p className="font-display italic text-2xl text-gold mt-3">{tipeLabel}</p>

            {/* Specs */}
            <dl className="mt-12 space-y-5">
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">Golongan</dt>
                <dd className="col-span-2 text-cream/85">{koleksi.golongan.namaGolongan} ({tipeLabel})</dd>
              </div>
              {koleksi.daerah && (
                <div className="grid grid-cols-3 border-t hairline pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">Daerah</dt>
                  <dd className="col-span-2 text-cream/85">{koleksi.daerah}</dd>
                </div>
              )}
              {/* {koleksi.kondisi && (
                <div className="grid grid-cols-3 border-t hairline pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">Kondisi</dt>
                  <dd className="col-span-2 text-cream/85">{koleksi.kondisi}</dd>
                </div>
              )} */}
              {/* <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">No. Wayang</dt>
                <dd className="col-span-2 text-cream/85 font-mono">{koleksi.noWayang}</dd>
              </div> */}

            {koleksi.deskripsi && (
              <p className="mt-10 text-cream/70 leading-[1.85] text-[15px]">{koleksi.deskripsi}</p>
            )}
            {koleksi.cerita && (
              <p className="mt-4 text-cream/60 leading-[1.85] text-[14px]">{koleksi.cerita}</p>
            )}

            </dl>

            <div className="mt-12 flex gap-4 flex-wrap">
              {/* <Link to="/kontak" className="btn-primary">Janji Kunjungan →</Link> */}
              <Link to="/koleksi" className="btn-ghost">← Kembali</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section className="px-8 md:px-20 py-24 md:py-28 border-t hairline">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 reveal">
              <div>
                <span className="eyebrow">Koleksi Terkait</span>
                <h2 className="font-display text-cream text-[clamp(28px,3.5vw,44px)] mt-3">
                  {tipeLabel} Lainnya
                </h2>
              </div>
              <Link to="/koleksi" className="arrow-link">
                Lihat semua <span className="line" />→
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/koleksi/${r.id}`}
                  className="lift border hairline p-3 block group"
                >
                  <div className="placeholder aspect-[3/4]">{r.nama.toUpperCase()}</div>
                  <div className="mt-4 px-1">
                    <h4 className="font-display text-xl group-hover:text-gold transition-colors">{r.nama}</h4>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45 mt-1">{tipeLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer variant="minimal" />
    </>
  )
}
