import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import gambarLokasi from '../assets/lokasi.png'

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ink">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/museum-wayang.jpg')" }}
        />
        {/* Gradient overlay — mengikuti warna latar tema (gelap/terang) */}
        <div className="absolute inset-0 z-10 hero-overlay" />

        <div className="relative z-20 text-center px-8 animate-[fadeInUp_1s_ease_0.3s_both]">
          <p className="eyebrow mb-6">Museum Wayang · Universitas Sanata Dharma</p>
          <h1 className="font-display text-[clamp(48px,8vw,104px)] leading-[1] text-cream">
            Koleksi Wayang Sutarwin
          </h1>
          <p className="mt-8 text-cream/60 text-lg max-w-md mx-auto leading-relaxed">
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
              <div className="placeholder aspect-[3/4]">FOTO KOLEKSI 1</div>
              <div className="placeholder aspect-[3/4] mt-8">FOTO KOLEKSI 2</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTER ── */}
      <section className="px-8 md:px-20 py-20 border-b hairline bg-panel">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
          {/* TODO: angka sementara — nantinya diambil dari API */}
          {[
            { num: '100+', label: 'Koleksi Wayang' },
            { num: '9', label: 'Kotak Penyimpanan' },
            { num: '5', label: 'Jenis Wayang' },
            { num: '20+', label: 'Kegiatan per Tahun' },
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
            {['ARJUNA', 'BIMA', 'KRESNA', 'SRIKANDI'].map((name, i) => (
              <Link
                key={name}
                to="/koleksi"
                className="group block lift border hairline p-3 reveal"
                style={{ ['--rd' as string]: `${i * 80}ms` }}
              >
                <div className="placeholder aspect-[3/4] group-hover:opacity-80 transition-opacity">
                  {name}
                </div>
                <div className="mt-4 px-1">
                  <h4 className="font-display text-xl text-cream group-hover:text-gold transition-colors">
                    {name.charAt(0) + name.slice(1).toLowerCase()}
                  </h4>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45 mt-1">Wayang Kulit</p>
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
