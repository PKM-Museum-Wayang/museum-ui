import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

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
        {/* Gradient overlay — sama seperti Laravel: gelap di bawah */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.92) 100%)',
          }}
        />

        <div className="relative z-20 text-center px-8 animate-[fadeInUp_1s_ease_0.3s_both]">
          <p className="eyebrow mb-6">Museum Wayang · Universitas Sanata Dharma</p>
          <h1 className="font-display text-[clamp(64px,12vw,160px)] leading-[0.9] text-cream">
            Museum<br /><em className="not-italic text-gold">Wayang.</em>
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
          <span className="text-[9px] uppercase tracking-[0.4em] text-cream/35">Scroll</span>
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section className="px-8 md:px-20 py-24 md:py-32 border-b hairline">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="eyebrow">— Tentang Koleksi</span>
            <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-tight text-cream mt-4">
              Seni cahaya<br /><em className="not-italic text-gold">dan bayangan.</em>
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
          {[
            { num: '10K+', label: 'Koleksi Wayang' },
            { num: '14', label: 'Daerah Asal' },
            { num: 'VI', label: 'Kategori' },
            { num: '60+', label: 'Kegiatan / Tahun' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center border-t hairline pt-8">
              <p className="font-display text-[clamp(40px,6vw,72px)] text-gold number-tabular leading-none">
                {num}
              </p>
              <p className="text-[9px] uppercase tracking-[0.35em] text-cream/45 mt-3">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KOLEKSI PREVIEW ── */}
      <section className="px-8 md:px-20 py-24 md:py-28 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 reveal">
            <div>
              <span className="eyebrow">— Koleksi Pilihan</span>
              <h2 className="font-display text-cream text-[clamp(32px,4vw,56px)] mt-3">
                Tokoh-tokoh <em className="not-italic text-gold">Pilihan.</em>
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
                <div className="flex justify-between items-baseline mt-4 px-1">
                  <div>
                    <h4 className="font-display text-xl text-cream group-hover:text-gold transition-colors">
                      {name.charAt(0) + name.slice(1).toLowerCase()}
                    </h4>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cream/45 mt-1">Wayang Kulit</p>
                  </div>
                  <span className="font-mono text-[10px] text-gold/60">
                    № {String(i + 1).padStart(3, '0')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOKASI ── */}
      <section className="px-8 md:px-20 py-24 md:py-28 border-b hairline">
        <div className="max-w-7xl mx-auto reveal">
          <span className="eyebrow">— Kunjungi Kami</span>
          <h2 className="font-display text-cream text-[clamp(32px,4vw,56px)] mt-3 mb-10">
            Lokasi <em className="not-italic text-gold">Museum.</em>
          </h2>
          <div className="border hairline aspect-[16/6] flex items-center justify-center bg-panel">
            <div className="text-center">
              <svg className="mx-auto mb-4 text-gold/40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/30">Peta lokasi akan segera tersedia</p>
              <p className="text-sm text-cream/50 mt-3">Kampus II USD, Jl. Affandi, Mrican, Yogyakarta 55281</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
