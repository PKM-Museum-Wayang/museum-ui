import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import gambarLokasi from '../assets/lokasi.png'
import koleksiGambar1 from '../assets/foto-koleksi-1.jpg'
import koleksiGambar2 from '../assets/foto-koleksi-2.jpeg'
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

interface KoleksiPreviewItem {
  id: number
  nama: string
  tipeGolongan: string
  gambar?: string
}

// Fisher–Yates, biar acaknya merata (bukan .sort(() => Math.random() - 0.5)
// yang bias)
const shuffle = <T,>(arr: T[]): T[] => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function Home() {

  const [totalWayang, setTotalWayang] = useState<number | null>(null)
  const [totalKotak, setTotalKotak] = useState<number | null>(null)
  const [totalJenis, setTotalJenis] = useState<number | null>(null)
  const [randomKoleksi, setRandomKoleksi] = useState<KoleksiPreviewItem[]>([])

  useEffect(() => {
    Promise.all([
      api.get('/wayang?limit=100'),
      api.get('/penyimpanan'),
      api.get('/golongan/all')
    ]).then(([wayangRes, kotakRes, golonganRes]) => {
      setTotalWayang(wayangRes.data.data.pagination.total)
      setTotalKotak(kotakRes.data.data.length)
      setTotalJenis(golonganRes.data.data.length)

      const wayangList: WayangApi[] = wayangRes.data.data.data
      const golonganList: Golongan[] = golonganRes.data.data
      const golonganMap = new Map(golonganList.map(g => [g.id, g]))

      const koleksi: KoleksiPreviewItem[] = wayangList.map(w => {
        const gambarMedia = w.media.find(m => m.jenis === 'IMAGE')
        return {
          id: w.id,
          nama: w.nama,
          tipeGolongan: golonganMap.get(w.golonganId)?.tipeGolongan ?? '',
          gambar: gambarMedia ? `${BASE_URL}${gambarMedia.fileUrl}` : undefined,
        }
      })

      setRandomKoleksi(shuffle(koleksi).slice(0, 4))
    }).catch(() => {})
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ink">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          // style={{ backgroundImage: "url('/museum-wayang.jpg')" }}
          style={{ backgroundImage: "url('/bg.JPG')" }}
        />
        {/* Gradient overlay — mengikuti warna latar tema (gelap/terang) */}
        <div className="absolute inset-0 z-10 hero-overlay" />

        <div className="relative z-20 text-center px-8 animate-[fadeInUp_1s_ease_0.3s_both]">
          <p className="eyebrow mb-6">Museum Wayang</p>
          <h1 className="font-display text-[clamp(48px,8vw,104px)] leading-[1] text-cream">
            Koleksi Wayang Sutarwin
          </h1>
          <p className="mt-8 text-cream/70 text-lg max-w-md mx-auto leading-relaxed">
            Merawat warisan, melanjutkan cerita.
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/koleksi" className="btn-primary">Jelajahi Koleksi →</Link>
            <Link to="/tentang" className="btn-ghost">Tentang Museum</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 animate-[fadeInUp_1s_ease_1s_both]">
          <div className="scroll-mouse-box" />
          <span className="text-[9px] uppercase tracking-[0.15em] text-cream/35">Scroll</span>
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section className="px-8 md:px-20 py-24 md:py-32 border-b hairline">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="eyebrow">Tentang Koleksi</span>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] leading-tight text-cream mt-4">
              Mengenal Wayang
            </h2>
            <p className="mt-8 text-cream/65 leading-[1.85]">
              Seni pewayangan adalah harmoni antara cahaya, bayangan, dan cerita.
              Melalui siluet yang diproyeksikan ke atas kelir, wayang kulit menceritakan
              epik kehidupan kuno yang sarat akan makna spiritual dan etika.
            </p>
            <p className="mt-4 text-cream/60 leading-[1.85] text-[15px]">
              Mahakarya budaya ini mendapat penghormatan global saat UNESCO
              menetapkannya sebagai Warisan Budaya Takbenda.
            </p>
            <Link to="/tentang" className="arrow-link mt-10 inline-flex">
              Lihat selengkapnya <span className="line" />→
            </Link>
          </div>
          <div className="reveal" style={{ ['--rd' as string]: '150ms' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="placeholder aspect-[4/3]">
                <img src={koleksiGambar1} alt="Koleksi 1" className="w-full h-full object-contain" />
              </div>
              <div className="placeholder aspect-[3/4] mt-8">
                <img src={koleksiGambar2} alt="Koleksi 2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTER ── */}
      <section className="px-8 md:px-20 py-20 border-b hairline bg-panel">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 reveal">
          {[
            { num: totalWayang !== null ? `${totalWayang}+`: '...' , label: 'Koleksi Wayang' },
            { num: totalKotak !== null ? `${totalKotak}`: '...', label: 'Kotak Penyimpanan' },
            { num: totalJenis !== null ? `${totalJenis}`: '...', label: 'Jenis Wayang' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center border-t hairline pt-8">
              <p className="font-display text-[clamp(40px,6vw,72px)] text-gold number-tabular leading-none">
                {num}
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-cream/45 mt-3">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KOLEKSI PREVIEW ── */}
      <section className="px-8 md:px-20 py-24 md:py-28 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 reveal">
            <div>
              <span className="eyebrow">Koleksi Pilihan</span>
              <h2 className="font-display text-cream text-[clamp(28px,3.5vw,44px)] mt-3">
                Beberapa Tokoh Koleksi
              </h2>
            </div>
            <Link to="/koleksi" className="arrow-link">
              Lihat semua <span className="line" />→
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {randomKoleksi.map((k, i) => (
              <Link
                key={k.id}
                to={`/koleksi/${k.id}`}
                className="group block lift border hairline p-3 reveal"
                style={{ ['--rd' as string]: `${i * 80}ms` }}
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
                  <div className="placeholder aspect-[3/4] group-hover:opacity-80 transition-opacity">
                    {k.nama.toUpperCase()}
                  </div>
                )}
                <div className="mt-4 px-1">
                  <h4 className="font-display text-xl text-cream group-hover:text-gold transition-colors">
                    {k.nama}
                  </h4>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45 mt-1">
                    {TIPE_GOLONGAN_LABEL[k.tipeGolongan] ?? 'Wayang Kulit'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOKASI ── */}
      <section className="px-8 md:px-20 py-24 md:py-28 border-b hairline">
        <div className="max-w-7xl mx-auto reveal">
          <h2 className="font-display text-cream text-[clamp(28px,3.5vw,44px)] mt-3 mb-10">
            Lokasi Museum
          </h2>
          <div className="border hairline aspect-[16/6] flex items-center justify-center bg-panel">
            <img src={gambarLokasi} alt="Lokasi Museum Wayang" />
          </div>
          <div className="btn mt-8 flex flex-wrap gap-4 justify-center">
            <button className="btn-primary">
              <a href="https://maps.app.goo.gl/Wv8V3GyPrPfV5ACD8" target='_blank'>Lokasi lebih lanjut →</a>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
