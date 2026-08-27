import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react' 
import Footer from '../components/Footer'
import api, { BASE_URL } from '../lib/api'

interface KegiatanItem {
  id: number
  nama: string
  deskripsi?: string | null
  tanggal: string
  lokasi: string
  imageUrl?: string | null
}

export default function Kegiatan() {
  const [KegiatanList, SetKegiatanList] = useState<KegiatanItem[]>([])
  const [Loading, SetLoading] = useState(true)


  useEffect(() => {
    api.get('/kegiatan', { params: { limit: 100 }}).then(res => {
      const list: KegiatanItem[] = res.data.data.data

      const terurut = [...list].sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      )

      SetKegiatanList(terurut)
    }).catch(() => SetKegiatanList([])).finally(() => SetLoading(false))
  }, [])
  
  return (
    <>
      <section className="relative pt-32 md:pt-44 pb-20 px-8 md:px-20 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <h1 className="reveal font-display text-[clamp(40px,6vw,72px)] leading-[1.05] mt-4 text-cream" style={{ ['--rd' as string]: '100ms' }}>
            Kegiatan
          </h1>
        </div>
      </section>

      <section className="px-8 md:px-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-baseline mb-12">
            <span className="eyebrow">Kegiatan</span>
          </div>

          {Loading ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-cream/40">Memuat kegiatan…</p>
            </div>
          ) : KegiatanList.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-cream/40">Belum ada kegiatan terjadwal.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gold/20 list-none m-0 p-0">
              {KegiatanList.map(k => {
                const waktu = new Date(k.tanggal)

            const tanggalLabel = waktu.toLocaleDateString('id-ID', { day: '2-digit' })
                const bulanLabel = waktu.toLocaleDateString('id-ID', { month: 'long' })
                const jamLabel = waktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                return (
                  <li key={k.id} className="reveal">
                    <Link to={`/kegiatan/${k.id}`} className="grid md:grid-cols-12 gap-6 py-10 items-center no-underline group">
                      <div className="md:col-span-2 flex md:flex-col items-baseline gap-3">
                        <span className="font-display text-gold text-6xl number-tabular leading-none">{tanggalLabel}</span>
                        <div>
                          <p className="font-display text-cream text-xl leading-tight">{bulanLabel}</p>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45">{jamLabel} WIB</p>
                        </div>
                      </div>

                     <div className="md:col-span-3">
                        {k.imageUrl ? (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={`${BASE_URL}${k.imageUrl}`}
                              alt={k.nama}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="placeholder aspect-[4/3] text-[9px]">{k.nama.toUpperCase()}</div>
                        )}
                      </div>

                      <div className="md:col-span-7">
                        <h3 className="font-display text-3xl text-cream group-hover:text-gold transition-colors">{k.nama}</h3>
                        {k.deskripsi && (
                          <p className="mt-3 text-cream/60 text-[14px] leading-relaxed line-clamp-2">{k.deskripsi}</p>
                        )}
                        <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-gold/70">{k.lokasi}</p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>                      
      </section>

      <Footer variant="minimal" />
    </>
  )
}
