import { useEffect, useRef, useState, type FormEvent } from 'react'
import axios from 'axios'
import api from '../lib/api'
import { Link } from 'react-router-dom'
import { biografiApi, biografiError, photoUrl } from '../lib/biografi'
import type { Biografi } from '../lib/biografi'

const TOPIK_LIST = [
  { label: 'Kunjungan', value: 'KUNJUNGAN' },
  { label: 'Penelitian', value: 'PENELITIAN' },
  { label: 'Kerja Sama', value: 'KERJA_SAMA' },
  { label: 'Donasi Koleksi', value: 'DONASI_KOLEKSI' },
  { label: 'Lainnya', value: 'LAINNYA' },
] as const

const formatHari = (hari: string) => hari.charAt(0) + hari.slice(1).toLowerCase()

interface FormState {
  namaLengkap: string
  asal: string
  email: string
  noTelp: string
  jenisTopik: typeof TOPIK_LIST[number]['value']
  pesan: string
}

const emptyForm: FormState = {
  namaLengkap: '', asal: '', email: '', noTelp: '', jenisTopik: 'KUNJUNGAN', pesan: '',
}

export default function Kontak() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const sendingRef = useRef(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [profile, setProfile] = useState<Biografi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [photoFailed, setPhotoFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    biografiApi.get(controller.signal).then(data => {
      if (!controller.signal.aborted) {
        setProfile(data)
        setError('')
        setPhotoFailed(false)
      }
    }).catch(err => {
      if (!controller.signal.aborted) {
        const failure = biografiError(err)
        setProfile(null)
        setError(failure.status === 404 ? 'Informasi kontak belum tersedia.' : 'Informasi kontak tidak dapat dimuat. Silakan coba lagi.')
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [retry])

  const set = (field: Exclude<keyof FormState, 'jenisTopik'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sendingRef.current) return
    const input: FormState = {
      ...form,
      namaLengkap: form.namaLengkap.trim(), asal: form.asal.trim(), email: form.email.trim(),
      noTelp: form.noTelp.trim(), pesan: form.pesan.trim(),
    }
    const errors: Partial<Record<keyof FormState, string>> = {}
    if (!input.namaLengkap) errors.namaLengkap = 'Nama lengkap wajib diisi.'
    if (!input.asal) errors.asal = 'Asal wajib diisi.'
    if (!input.email) errors.email = 'Email wajib diisi.'
    if (!/^\+?\d{8,15}$/.test(input.noTelp)) errors.noTelp = 'Gunakan 8–15 digit, boleh diawali +, tanpa spasi atau tanda hubung.'
    if (!input.pesan) errors.pesan = 'Pesan wajib diisi.'
    setFieldErrors(errors)
    setFormError('')
    if (Object.keys(errors).length) {
      setFormError('Periksa kembali kolom yang ditandai.')
      return
    }
    sendingRef.current = true
    setSending(true)
    try {
      await api.post('/pesan-kontak', input)
      setForm(emptyForm)
      setSent(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const body = err.response.data
        const serverErrors: Partial<Record<keyof FormState, string>> = {}
        if (Array.isArray(body?.errors)) {
          for (const item of body.errors) {
            if (item && typeof item.field === 'string' && item.field in emptyForm && typeof item.message === 'string') {
              serverErrors[item.field as keyof FormState] = item.message
            }
          }
        }
        setFieldErrors(serverErrors)
        setFormError(err.response.status === 400
          ? (typeof body?.message === 'string' ? body.message : 'Periksa kembali data yang Anda masukkan.')
          : 'Pesan belum dapat dikirim karena terjadi kesalahan server. Silakan coba lagi.')
      } else {
        setFormError('Tidak dapat memastikan pesan terkirim karena koneksi bermasalah. Pengiriman ulang dapat menyebabkan pesan ganda.')
      }
    } finally {
      sendingRef.current = false
      setSending(false)
    }
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
                <p className="mt-4 text-cream/65" role="status">Pesan Anda berhasil dikirim dan tersimpan. Terima kasih telah menghubungi kami.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-8">Kirim pesan lagi</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} aria-busy={sending} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {formError && <div role="alert" className="md:col-span-2 border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200">{formError}</div>}
                <div>
                  <label htmlFor="namaLengkap" className="form-label">Nama Lengkap *</label>
                  <input id="namaLengkap" className="input" value={form.namaLengkap} onChange={set('namaLengkap')} placeholder="Nama Anda" required maxLength={255} disabled={sending} aria-invalid={!!fieldErrors.namaLengkap} aria-describedby={fieldErrors.namaLengkap ? 'namaLengkap-error' : undefined} />
                  {fieldErrors.namaLengkap && <p id="namaLengkap-error" className="mt-2 text-sm text-red-300">{fieldErrors.namaLengkap}</p>}
                </div>
                <div>
                  <label htmlFor="asal" className="form-label">Asal *</label>
                  <input id="asal" className="input" value={form.asal} onChange={set('asal')} placeholder="Kota atau institusi" required maxLength={255} disabled={sending} aria-invalid={!!fieldErrors.asal} aria-describedby={fieldErrors.asal ? 'asal-error' : undefined} />
                  {fieldErrors.asal && <p id="asal-error" className="mt-2 text-sm text-red-300">{fieldErrors.asal}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input id="email" className="input" type="email" value={form.email} onChange={set('email')} placeholder="anda@email.com" required maxLength={255} disabled={sending} aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'email-error' : undefined} />
                  {fieldErrors.email && <p id="email-error" className="mt-2 text-sm text-red-300">{fieldErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="noTelp" className="form-label">Telepon *</label>
                  <input id="noTelp" className="input" type="tel" value={form.noTelp} onChange={set('noTelp')} placeholder="081234567890" required maxLength={16} disabled={sending} aria-invalid={!!fieldErrors.noTelp} aria-describedby="noTelp-help" />
                  <p id="noTelp-help" className={`mt-2 text-xs ${fieldErrors.noTelp ? 'text-red-300' : 'text-cream/50'}`}>{fieldErrors.noTelp || '8–15 digit, tanpa spasi atau tanda hubung.'}</p>
                </div>

                <div className="md:col-span-2">
                  <span id="topik-label" className="form-label">Topik *</span>
                  <div role="group" aria-labelledby="topik-label" className="flex flex-wrap gap-2 mt-2">
                    {TOPIK_LIST.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        disabled={sending}
                        aria-pressed={form.jenisTopik === t.value}
                        className={`chip${form.jenisTopik === t.value ? ' is-active' : ''}`}
                        onClick={() => { setForm(prev => ({ ...prev, jenisTopik: t.value })); setFieldErrors(prev => ({ ...prev, jenisTopik: undefined })) }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.jenisTopik && <p className="mt-2 text-sm text-red-300">{fieldErrors.jenisTopik}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="pesan" className="form-label">Pesan *</label>
                  <textarea id="pesan" className="input" value={form.pesan} onChange={set('pesan')} rows={5} placeholder="Ceritakan kebutuhan Anda…" required maxLength={10000} disabled={sending} aria-invalid={!!fieldErrors.pesan} aria-describedby={fieldErrors.pesan ? 'pesan-error' : undefined} />
                  {fieldErrors.pesan && <p id="pesan-error" className="mt-2 text-sm text-red-300">{fieldErrors.pesan}</p>}
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="submit" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={sending}>{sending ? 'Mengirim…' : 'Kirim Pesan →'}</button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: info */}
          <aside className="md:col-span-5 reveal" style={{ ['--rd' as string]: '200ms' }}>
            <span className="eyebrow">Pemilik Koleksi</span>

            {loading ? <p role="status" className="mt-6 text-cream/60">Memuat informasi kontak…</p> : error ? <div role="alert" className="mt-6 border hairline p-8 text-cream/65">
              <p>{error}</p>
              <button type="button" onClick={() => { setLoading(true); setError(''); setRetry(value => value + 1) }} className="btn-ghost mt-6">Coba lagi</button>
            </div> : profile && <>
            <div className="mt-6 border hairline p-8">
              <div className="w-24 aspect-square overflow-hidden">
                {!photoFailed ? <img
                  src={photoUrl(profile.fotoProfil)}
                  alt={`Foto ${profile.namaPemilikKoleksi}`}
                  onError={() => setPhotoFailed(true)}
                  className="w-full h-full object-cover"
                /> : <div className="w-full h-full grid place-items-center border hairline text-xs text-cream/50">Tanpa foto</div>}
              </div>
              <h3 className="font-display text-3xl text-cream mt-6">{profile.namaPemilikKoleksi}</h3>
              <p className="font-display italic text-gold mt-1">Pemilik Koleksi Wayang</p>
              <dl className="mt-8 space-y-4 text-[14px]">
                <div className="border-t hairline pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">Surel Pribadi</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${encodeURIComponent(profile.email)}`} className="text-cream/85 hover:text-gold transition-colors break-all">
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <div className="border-t hairline pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">Telepon</dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${profile.phoneNumber}`}
                      className="text-cream/85 hover:text-gold transition-colors"
                    >
                      {profile.phoneNumber}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-12">
              <span className="eyebrow">Saluran Resmi</span>
              <dl className="mt-6 space-y-5 text-[14px]">
                {[
                  { label: 'Alamat', val: profile.alamat },
                  { label: 'Hari Buka', val: `${formatHari(profile.hariMulai)} — ${formatHari(profile.hariSelesai)}` },
                  { label: 'Jam Buka', val: `${profile.jamBuka} — ${profile.jamTutup}` },
                ].map(({ label, val }) => (
                  <div key={label} className="border-t hairline pt-4 grid grid-cols-3">
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-gold/70">{label}</dt>
                    <dd className="col-span-2 text-cream/85 leading-relaxed whitespace-pre-line break-words">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {[profile.instagram, profile.facebook, profile.youtube].some(Boolean) && <div className="mt-12">
              <span className="eyebrow">Media Sosial</span>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {([['Instagram', profile.instagram], ['Facebook', profile.facebook], ['YouTube', profile.youtube]] as const).map(([label, url]) => url && <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="text-cream/85 hover:text-gold transition-colors">{label} ↗</a>)}
              </div>
            </div>}
            </>}
          </aside>
        </div>
      </section>

      <footer className="border-t hairline px-8 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex justify-between text-[10px] uppercase tracking-[0.15em] text-cream/40">
          <span>© 2026 Koleksi Wayang Sutarwin</span>
          <Link to="/" className="hover:text-gold transition-colors">← Kembali ke beranda</Link>
        </div>
      </footer>
    </>
  )
}
