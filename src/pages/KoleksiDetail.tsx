import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'

/* ── Mock data — ganti dengan fetch ke API saat backend siap ── */
const MOCK_KOLEKSI = [
  { id: 1, nama: 'Arjuna', jenis: 'Wayang Kulit', bahan: 'Kulit kerbau, cat alam', deskripsi: 'Arjuna adalah tokoh utama dalam wiracarita Mahabharata. Ia dikenal sebagai ksatria paling sakti, pemanah handal, dan murid kesayangan Begawan Drona. Dalam pewayangan Jawa, Arjuna dilukiskan berwajah tampan, berkulit kuning, berperawakan ramping, dan bermata sipit.' },
  { id: 2, nama: 'Bima', jenis: 'Wayang Kulit', bahan: 'Kulit kerbau, cat alam', deskripsi: 'Bima atau Werkudara adalah putera kedua dari Pandawa Lima. Dikenal karena kekuatannya yang luar biasa, ia memiliki senjata andalan berupa Gada Rujakpolo dan kuku Pancanaka yang mampu merobek apa saja.' },
  { id: 3, nama: 'Kresna', jenis: 'Wayang Kulit', bahan: 'Kulit kerbau, cat alam', deskripsi: 'Kresna adalah awatara Wisnu dan penasihat utama Pandawa. Kebijaksanaannya yang tinggi tercurah dalam Bhagavad Gita, dialog antara Kresna dan Arjuna di medan Kurukshetra sebelum perang dimulai.' },
  { id: 4, nama: 'Srikandi', jenis: 'Wayang Kulit', bahan: 'Kulit kerbau, cat alam', deskripsi: 'Srikandi adalah putri Raja Drupada dari Kerajaan Pancala dan istri Arjuna. Ia dikenal sebagai prajurit wanita yang perkasa dan pandai memanah, setara kemampuannya dengan para ksatria pria.' },
  { id: 5, nama: 'Gatotkaca', jenis: 'Wayang Kulit', bahan: 'Kulit kerbau, cat alam', deskripsi: 'Gatotkaca adalah putra Bima dari Arimbi, raksasa perempuan dari Kerajaan Pringgandani. Ia memiliki kemampuan terbang dan kulit yang kebal senjata, dijuluki "otot kawat tulang besi".' },
  { id: 8, nama: 'Cepot', jenis: 'Wayang Golek', bahan: 'Kayu, cat, kain', deskripsi: 'Cepot atau Astrajingga adalah punakawan utama dalam wayang golek Sunda. Ia dikenal humoris, kritis, dan berani menyampaikan kebenaran melalui humor kepada siapa saja, termasuk tuannya.' },
]

export default function KoleksiDetail() {
  const { id } = useParams()
  const koleksi = MOCK_KOLEKSI.find(k => k.id === Number(id))

  if (!koleksi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl text-cream/40">Koleksi tidak ditemukan.</p>
        <Link to="/koleksi" className="btn-ghost mt-8">← Kembali ke Koleksi</Link>
      </div>
    )
  }

  const related = MOCK_KOLEKSI.filter(k => k.jenis === koleksi.jenis && k.id !== koleksi.id).slice(0, 3)

  return (
    <>
      {/* ── BREADCRUMB ── */}
      <div className="px-8 md:px-20 pt-32 md:pt-36 pb-6 text-[11px] uppercase tracking-[0.3em] text-cream/45 flex gap-3 items-center flex-wrap">
        <Link to="/koleksi" className="hover:text-gold transition-colors">Koleksi</Link>
        <span className="text-gold/40">/</span>
        <Link to={`/koleksi?jenis=${koleksi.jenis}`} className="hover:text-gold transition-colors">{koleksi.jenis}</Link>
        <span className="text-gold/40">/</span>
        <span className="text-gold">{koleksi.nama}</span>
      </div>

      {/* ── HERO ── */}
      <section className="px-8 md:px-20 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">
          {/* Gallery */}
          <div className="md:col-span-7 reveal">
            <div className="placeholder aspect-[4/5]">{koleksi.nama.toUpperCase()}</div>
          </div>

          {/* Info */}
          <div className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <div className="flex justify-between items-start">
              <span className="eyebrow">— Koleksi № {String(koleksi.id).padStart(3, '0')}</span>
              <span className="font-mono text-[10px] text-cream/40">
                USD-WK-{String(koleksi.id).padStart(3, '0')}
              </span>
            </div>

            <h1 className="font-display text-[clamp(56px,8vw,108px)] text-cream leading-[0.95] mt-6">
              {koleksi.nama}.
            </h1>
            <p className="font-display italic text-2xl text-gold mt-3">{koleksi.jenis}</p>

            <p className="mt-10 text-cream/70 leading-[1.85] text-[15px]">{koleksi.deskripsi}</p>

            {/* Specs */}
            <dl className="mt-12 space-y-5">
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Jenis</dt>
                <dd className="col-span-2 text-cream/85">{koleksi.jenis}</dd>
              </div>
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Bahan</dt>
                <dd className="col-span-2 text-cream/85">{koleksi.bahan}</dd>
              </div>
              <div className="grid grid-cols-3 border-t hairline pt-4">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Nomor</dt>
                <dd className="col-span-2 text-cream/85">USD-WK-{String(koleksi.id).padStart(3, '0')}</dd>
              </div>
            </dl>

            <div className="mt-12 flex gap-4 flex-wrap">
              <Link to="/kontak" className="btn-primary">Janji Kunjungan →</Link>
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
                <span className="eyebrow">— Koleksi Terkait</span>
                <h2 className="font-display text-cream text-[clamp(32px,4vw,56px)] mt-3">
                  {koleksi.jenis} <em className="not-italic text-gold">Lainnya</em>
                </h2>
              </div>
              <Link to={`/koleksi?jenis=${koleksi.jenis}`} className="arrow-link">
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
                  <div className="flex justify-between items-baseline mt-4 px-1">
                    <div>
                      <h4 className="font-display text-xl group-hover:text-gold transition-colors">{r.nama}</h4>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/45 mt-1">{r.jenis}</p>
                    </div>
                    <span className="font-mono text-[10px] text-gold/60">
                      № {String(r.id).padStart(3, '0')}
                    </span>
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
