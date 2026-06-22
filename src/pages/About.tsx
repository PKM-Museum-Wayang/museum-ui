import { Link } from 'react-router-dom'

const TIM = [
  { nama: 'Drs. Sutarwinarno', peran: 'Pemilik Wayang' },
  { nama: 'Bu Paulina', peran: 'Koordinator PKM' },
  { nama: 'Pak Kartono', peran: 'Koordinator PKM' },
  { nama: 'Nicolaus Reva Sagraha', peran: 'Pengembang Aplikasi' },
  { nama: 'Vincensius Damar Adyatma', peran: 'Pengembang Aplikasi' },
]

export default function About() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 px-8 md:px-20 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <h1 className="reveal font-display text-[clamp(56px,10vw,148px)] leading-[0.95] mt-6 text-cream" style={{ ['--rd' as string]: '100ms' }}>
            Sebuah rumah,<br /><em className="not-italic text-gold">untuk warisan.</em>
          </h1>
          <p className="reveal mt-12 max-w-2xl text-cream/65 leading-[1.85] text-lg" style={{ ['--rd' as string]: '250ms' }}>
            Museum Wayang Universitas Sanata Dharma berdiri sebagai upaya
            akademis untuk merawat, mendokumentasikan, dan menghidupkan
            kembali warisan pewayangan Nusantara di tengah generasi baru.
          </p>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="px-8 md:px-20 py-24 md:py-32 border-b hairline">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7 reveal">
            <div className="placeholder aspect-[4/3]">INTERIOR MUSEUM · GALERI UTAMA</div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-cream/45">Plate I — Galeri Utama</p>
          </div>
          <div className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <span className="eyebrow">— Visi</span>
            <h2 className="font-display text-gold text-[clamp(32px,4.5vw,56px)] leading-tight mt-4">
              Merawat warisan,<br />melanjutkan cerita.
            </h2>
            <p className="mt-8 text-cream/70 leading-[1.85]">
              Kami percaya bahwa wayang bukan benda mati — ia adalah
              percakapan yang terus berlangsung antara masa lalu dan masa
              kini. Misi kami bukan hanya menyimpan, tetapi membuka ruang
              bagi cerita-cerita itu untuk ditemukan, dipahami, dan
              diteruskan.
            </p>
            <p className="mt-6 text-cream/60 leading-[1.85] text-[15px]">
              Setiap tokoh dalam koleksi kami memiliki nomor inventaris,
              catatan asal, dan riwayat perawatan — disusun dengan disiplin
              arsip akademik USD.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIM ── */}
      <section className="px-8 md:px-20 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <span className="eyebrow">— Tim</span>
            <h2 className="font-display text-cream text-[clamp(36px,5vw,64px)] mt-3">
              Orang-orang di balik layar.
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6">
            {TIM.map(({ nama, peran }, i) => (
              <div key={nama} className="reveal" style={{ ['--rd' as string]: `${i * 80}ms` }}>
                <div className="placeholder aspect-[3/4]">FOTO</div>
                <h4 className="font-display text-xl text-cream mt-4">{nama}</h4>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cream/45 mt-1">{peran}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t hairline px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex justify-between text-[10px] uppercase tracking-[0.3em] text-cream/40">
          <span>Museum Wayang USD</span>
          <Link to="/kontak" className="hover:text-gold transition-colors">Hubungi kami →</Link>
        </div>
      </footer>
    </>
  )
}
