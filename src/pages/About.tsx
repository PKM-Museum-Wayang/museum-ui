import { Link } from 'react-router-dom'
import gambarInterior from '../assets/bg.jpg'
import person1 from '../assets/pak_sutarwinarno.jpeg'
import person2 from '../assets/pak_sutarwidargo.jpeg'
import person3 from '../assets/pak_sutarwinarmo.jpeg'
import person4 from '../assets/pak_kartono.jpeg'
import person5 from '../assets/pak_rio.jpeg'
import person6 from '../assets/bu_polina.jpeg'
import person7 from '../assets/reva.jpg'
import person8 from '../assets/vito.jpeg'


const TIM = [
  { nama: 'Sutarwinarno', peran: 'Pemilik Wayang', gambar: person1 },
  { nama: 'Sutarwindargo', peran: 'Pemilik Wayang', gambar: person2 },
  { nama: 'Sutarwinarmo', peran: 'Pemilik Wayang', gambar: person3 },
  { nama: 'Agnes Maria Polina S.Kom., M.Sc.', peran: 'Koordinator PKM', gambar: person6 },
  { nama: 'Ir.Kartono Pinaryanto S.T., M.Cs.', peran: 'Koordinator PKM', gambar: person4 },
  { nama: 'Drs. Silverio R. L. Aji Sampurno, M.Hum.', peran: 'Koordinator PKM', gambar: person5 },
  { nama: 'Nicolaus Reva Sagraha., S.Kom', peran: 'Pengembang website', gambar: person7 },
  { nama: 'Vincensius Damar Adyatma., S.Kom', peran: 'Pengembang website', gambar: person8 }
]

export default function About() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 px-8 md:px-20 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <span className="eyebrow reveal">Tentang Kami</span>
          <h1 className="reveal font-display text-[clamp(40px,6vw,72px)] leading-[1.05] mt-4 text-cream" style={{ ['--rd' as string]: '100ms' }}>
            Tentang Koleksi
          </h1>
          <p className="reveal mt-8 max-w-2xl text-cream/65 leading-[1.85] text-lg" style={{ ['--rd' as string]: '250ms' }}>
            Website ini dibuat untuk mendokumentasikan koleksi wayang milik
            Bapak Sutarwinarno, bekerja sama dengan tim PKM Universitas
            Sanata Dharma, agar koleksi dan ceritanya bisa dikenal lebih luas.
          </p>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="px-8 md:px-20 py-24 md:py-32 border-b hairline">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7 reveal">
            <div className="placeholder aspect-[4/3]">
              <img src={gambarInterior} alt="INTERIOR KOLEKSI · GALERI UTAMA" />
            </div>
          </div>
          <div className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <span className="eyebrow">Sejarah Koleksi</span>
            <h2 className="font-display text-cream text-[clamp(28px,3.5vw,44px)] leading-tight mt-4">
              Merawat warisan, melanjutkan cerita
            </h2>
            <p className="mt-8 text-cream/70 leading-[1.85]">
              Koleksi ini dikumpulkan dan dirawat oleh Bapak Sutarwinarno
              selama bertahun-tahun. Wayang-wayangnya masih dipakai —
              dipinjam untuk pentas dan dikenalkan ke generasi baru, bukan
              hanya disimpan di dalam kotak.
            </p>
            <p className="mt-6 text-cream/60 leading-[1.85] text-[15px]">
              Setiap wayang memiliki nomor inventaris dan catatan kondisi
              yang didokumentasikan melalui website ini.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIM ── */}
      <section className="px-8 md:px-20 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <span className="eyebrow">Tim</span>
            <h2 className="font-display text-cream text-[clamp(28px,3.5vw,44px)] mt-3">
              Tim di Balik Website Ini
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-6 gap-6">
            {TIM.map(({ nama, peran, gambar }, i) => (
              <div key={nama} className="reveal" style={{ ['--rd' as string]: `${i * 80}ms` }}>
                <div className="placeholder aspect-[3/4]"><img src={gambar} alt="" /></div>
                <h4 className="font-display text-xl text-cream mt-4">{nama}</h4>
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/45 mt-1">{peran}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t hairline px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex justify-between text-[10px] uppercase tracking-[0.15em] text-cream/40">
          <span>Koleksi Wayang Sutarwin</span>
          <Link to="/kontak" className="hover:text-gold transition-colors">Hubungi kami →</Link>
        </div>
      </footer>
    </>
  )
}
