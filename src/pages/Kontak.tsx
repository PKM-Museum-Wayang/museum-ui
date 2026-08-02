import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

const TOPIK_LIST = ['Kunjungan', 'Penelitian', 'Kerja Sama', 'Donasi Koleksi', 'Lainnya']

interface FormState {
  nama: string
  asal: string
  email: string
  telepon: string
  topik: string
  pesan: string
}

export default function Kontak() {
  const [form, setForm] = useState<FormState>({
    nama: '', asal: '', email: '', telepon: '', topik: 'Kunjungan', pesan: '',
  })
  const [sent, setSent] = useState(false)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    /* TODO: kirim ke endpoint API backend */
    console.log('Form submitted:', form)
    setSent(true)
  }

  return (
    <>
      {/* ── HEADER ── */}
      <section className="pt-32 md:pt-44 pb-16 px-8 md:px-20 border-b hairline">
        <div className="max-w-7xl mx-auto">
          <span className="eyebrow reveal">Kontak</span>
          <h1 className="reveal font-display text-[clamp(40px,6vw,72px)] leading-[1.05] mt-4 text-cream" style={{ ['--rd' as string]: '100ms' }}>
            Hubungi Kami
          </h1>
          <p className="reveal mt-6 max-w-xl text-cream/65 leading-[1.85]" style={{ ['--rd' as string]: '250ms' }}>
            Ingin berkunjung, meneliti koleksi, atau meminjam wayang untuk
            pentas? Kirim pesan lewat formulir di bawah, atau hubungi
            langsung melalui kontak yang tersedia.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-8 md:px-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">

          {/* LEFT: form */}
          <div className="md:col-span-7 reveal">
            <span className="eyebrow">Formulir</span>
            <h2 className="font-display text-cream text-[clamp(28px,3.5vw,44px)] mt-3">Kirim Pesan</h2>

            {sent ? (
              <div className="mt-12 border hairline p-10 text-center">
                <p className="font-display text-3xl text-gold">Terima Kasih.</p>
                <p className="mt-4 text-cream/65">Pesan Anda telah kami terima. Kami akan menghubungi Anda segera.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-8">Kirim pesan lagi</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <label className="form-label">Nama Lengkap</label>
                  <input className="input" value={form.nama} onChange={set('nama')} placeholder="Nama Anda" required />
                </div>
                <div>
                  <label className="form-label">Asal</label>
                  <input className="input" value={form.asal} onChange={set('asal')} placeholder="Institusi atau —" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="anda@email.com" required />
                </div>
                <div>
                  <label className="form-label">Telepon</label>
                  <input className="input" value={form.telepon} onChange={set('telepon')} placeholder="+62" />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Topik</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TOPIK_LIST.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`chip${form.topik === t ? ' is-active' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, topik: t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Pesan</label>
                  <textarea className="input" value={form.pesan} onChange={set('pesan')} rows={5} placeholder="Ceritakan kebutuhan Anda…" required />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="submit" className="btn-primary">Kirim Pesan →</button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: info */}
          <aside className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <span className="eyebrow">Pemilik Museum</span>

            <div className="mt-6 border hairline p-8">
              <div className="placeholder w-24 aspect-square text-[8px]">FOTO</div>
              <h3 className="font-display text-3xl text-cream mt-6">Drs. Sutarwinarno</h3>
              <p className="font-display italic text-gold mt-1">Pemilik Wayang</p>
              <dl className="mt-8 space-y-4 text-[14px]">
                <div className="border-t hairline pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">Surel Pribadi</dt>
                  <dd className="text-cream/85 mt-2">Sutarwinarno@usd.ac.id</dd>
                </div>
                <div className="border-t hairline pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">WhatsApp</dt>
                  <dd className="text-cream/85 mt-2">+62 812 2700 0001</dd>
                </div>
              </dl>
            </div>

            <div className="mt-12">
              <span className="eyebrow">Saluran Resmi</span>
              <dl className="mt-6 space-y-5 text-[14px]">
                {[
                  { label: 'Surel', val: 'museum.wayang@usd.ac.id' },
                  { label: 'Telepon', val: '+62 274 513 301 (ext. 1408)' },
                  { label: 'Alamat', val: 'Kampus II USD\nJl. Affandi, Mrican,\nCaturtunggal, Yogyakarta 55281' },
                  { label: 'Jam Buka', val: 'Senin — Jumat · 09.00 — 14.00\nAkhir pekan dengan janji temu' },
                ].map(({ label, val }) => (
                  <div key={label} className="border-t hairline pt-4 grid grid-cols-3">
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">{label}</dt>
                    <dd className="col-span-2 text-cream/85 leading-relaxed whitespace-pre-line">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-12 border-t hairline pt-8">
              <span className="eyebrow">Sosial</span>
              <div className="mt-4 flex flex-col gap-2 text-cream/85">
                {[
                  { handle: '@museumwayang.usd', platform: 'Instagram' },
                  { handle: 'Museum Wayang USD', platform: 'YouTube' },
                  { handle: 'museumwayang_usd', platform: 'TikTok' },
                ].map(({ handle, platform }) => (
                  <a
                    key={platform}
                    href="#"
                    className="hover:text-gold transition-colors flex justify-between border-b hairline pb-2"
                  >
                    {handle}
                    <span className="text-cream/40 text-[10px]">{platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t hairline px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex justify-between text-[10px] uppercase tracking-[0.15em] text-cream/40">
          <span>© 2026 Museum Wayang USD</span>
          <Link to="/" className="hover:text-gold transition-colors">← Kembali ke beranda</Link>
        </div>
      </footer>
    </>
  )
}
