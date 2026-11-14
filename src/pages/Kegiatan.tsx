import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react' 
import Footer from '../components/Footer'
import api, { BASE_URL } from '../lib/api'
import CollectionPhoto from '../components/CollectionPhoto'
import fotoPementasan from '../assets/kegiatan-hero.webp'

interface KegiatanItem {
  id: number
  nama: string
  deskripsi?: string | null
  tanggal: string
  lokasi: string
  gambar: { id: number; fileUrl: string }[]
}

export default function Kegiatan() {
  const [KegiatanList, SetKegiatanList] = useState<KegiatanItem[]>([])
  const [Loading, SetLoading] = useState(true)


  const [page, setPage] = useState(1)
  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSampai, setTanggalSampai] = useState('')
  const tanggalTidakValid = !!tanggalMulai && !!tanggalSampai && tanggalMulai > tanggalSampai
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (tanggalTidakValid) return
    const controller = new AbortController()
    SetLoading(true)
    setError(false)
    const awal = tanggalMulai ? new Date(`${tanggalMulai}T00:00:00`) : undefined
    const akhir = tanggalSampai ? new Date(`${tanggalSampai}T00:00:00`) : undefined
    if (akhir) akhir.setDate(akhir.getDate() + 1)
    api.get('/kegiatan', { params: { page, limit: 12, tanggalMulai: awal?.toISOString(), tanggalSampai: akhir?.toISOString() }, signal: controller.signal }).then(res => {
      SetKegiatanList(res.data.data.data)
      setTotalPages(res.data.data.pagination.totalPages)
      setTotal(res.data.data.pagination.total)
    }).catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) SetLoading(false) })
    return () => controller.abort()
  }, [page, tanggalMulai, tanggalSampai, tanggalTidakValid, retry])

  return (
    <>
      <section className="relative min-h-[40svh] md:min-h-[65vh] flex flex-col items-center justify-center overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${fotoPementasan})` }} />
        <div className="absolute inset-0 z-10 hero-overlay" />
        <div className="relative z-20 text-center px-8 animate-[fadeInUp_1s_ease_0.3s_both]">
          <h1 className="font-display text-[clamp(36px,10vw,48px)] md:text-[clamp(48px,8vw,104px)] leading-[1] text-cream">
            Kegiatan
          </h1>
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-20 py-12 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <h2 className="eyebrow">Daftar Kegiatan</h2>
              {!Loading && !error && !tanggalTidakValid && <p className="mt-2 text-xs text-cream/65">{total} kegiatan</p>}
            </div>
            <div className="flex flex-wrap items-end gap-3 sm:gap-4">
              <label className="flex flex-col gap-2 text-xs text-cream/75 flex-1 min-w-[135px] sm:flex-none">Dari tanggal
                <input type="date" value={tanggalMulai} max={tanggalSampai || undefined} onChange={e => { setTanggalMulai(e.target.value); setPage(1) }} className="activity-date border hairline bg-transparent text-cream px-3 py-2 text-sm min-h-11 w-full sm:w-auto" />
              </label>
              <label className="flex flex-col gap-2 text-xs text-cream/75 flex-1 min-w-[135px] sm:flex-none">Sampai tanggal
                <input type="date" value={tanggalSampai} min={tanggalMulai || undefined} onChange={e => { setTanggalSampai(e.target.value); setPage(1) }} className="activity-date border hairline bg-transparent text-cream px-3 py-2 text-sm min-h-11 w-full sm:w-auto" />
              </label>
              {(tanggalMulai || tanggalSampai) && <button className="text-sm text-gold underline min-h-11" onClick={() => { setTanggalMulai(''); setTanggalSampai(''); setPage(1) }}>Hapus tanggal</button>}
            </div>
          </div>

          {tanggalTidakValid ? (
            <p role="alert" className="text-center py-16 text-cream/75">Tanggal akhir harus sama dengan atau setelah tanggal awal.</p>
          ) : Loading ? (
            <div className="text-center py-16 md:py-24">
              <p className="font-display text-2xl text-cream/65">Memuat kegiatan…</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 md:py-24"><p>Gagal memuat kegiatan.</p><button className="btn-ghost mt-6" onClick={() => setRetry(n => n + 1)}>Coba lagi</button></div>
          ) : KegiatanList.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p className="font-display text-2xl text-cream/65">{tanggalMulai || tanggalSampai ? 'Kegiatan tidak ditemukan.' : 'Belum ada kegiatan terjadwal.'}</p>
              {(tanggalMulai || tanggalSampai) && <button className="btn-ghost mt-6" onClick={() => { setTanggalMulai(''); setTanggalSampai(''); setPage(1) }}>Lihat semua kegiatan</button>}
            </div>
          ) : (
            <ul className="divide-y divide-gold/20 list-none m-0 p-0">
              {KegiatanList.map(k => {
                const waktu = new Date(k.tanggal)

            const tanggalLabel = waktu.toLocaleDateString('id-ID', { day: '2-digit' })
                const bulanLabel = waktu.toLocaleDateString('id-ID', { month: 'long' })

                return (
                  <li key={k.id} className="reveal">
                    <Link to={`/kegiatan/${k.id}`} className="grid sm:grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6 py-8 md:py-10 items-center no-underline group">
                      <div className="sm:col-span-2 md:col-span-2 flex md:flex-col items-baseline gap-3">
                        <span className="font-display text-gold text-4xl md:text-6xl number-tabular leading-none">{tanggalLabel}</span>
                        <div>
                          <p className="font-display text-cream text-xl leading-tight">{bulanLabel}</p>
                        </div>
                      </div>

                     <div className="md:col-span-3">
                        <CollectionPhoto key={k.gambar[0]?.fileUrl} src={k.gambar[0] ? `${BASE_URL}${k.gambar[0].fileUrl}` : undefined} name={k.nama} className="aspect-[4/3]" />
                      </div>

                      <div className="md:col-span-7">
                        <h3 className="font-display text-2xl md:text-3xl text-cream group-hover:text-gold transition-colors">{k.nama}</h3>
                        {k.deskripsi && (
                          <p className="mt-3 text-cream/60 text-[14px] leading-relaxed line-clamp-2">{k.deskripsi}</p>
                        )}
                        <p className="mt-4 text-xs uppercase tracking-[0.15em] text-gold/70">{k.lokasi}</p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          {!Loading && !error && !tanggalTidakValid && totalPages > 1 && <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-10">
            <button className="btn-ghost disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</button>
            <span>Halaman {page} dari {totalPages}</span>
            <button className="btn-ghost disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Berikutnya</button>
          </div>}
        </div>                      
      </section>

      <Footer variant="minimal" />
    </>
  )
}
