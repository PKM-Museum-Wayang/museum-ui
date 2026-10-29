import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { biografiApi, biografiError, HARI, photoUrl } from '../lib/biografi'
import type { Biografi, BiografiFields } from '../lib/biografi'

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 aria-invalid:border-red-300 aria-invalid:focus:ring-red-50 disabled:bg-slate-50 disabled:cursor-not-allowed'
const labelClass = 'block text-xs sm:text-sm font-bold text-slate-700 mb-2'
const buttonClass = 'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'

function Icon({ kind, className = '' }: { kind: 'user' | 'clock' | 'link' | 'photo' | 'save'; className?: string }) {
  const paths = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7 .2l3-3a5 5 0 0 0-7-7l-2 2" /><path d="M14 11a5 5 0 0 0-7-.2l-3 3a5 5 0 0 0 7 7l2-2" /></>,
    photo: <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
    save: <><path d="m19 21-14 0a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z" /><path d="M7 3v6h10V3M7 21v-8h10v8" /></>,
  }
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[kind]}</svg>
}

function FormSection({ title, description, icon, children }: {
  title: string; description: string; icon: 'user' | 'clock' | 'link' | 'photo'; children: ReactNode
}) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon kind={icon} /></div>
      <div><h2 className="text-sm sm:text-base font-bold text-slate-800">{title}</h2><p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p></div>
    </div>
    <div className="p-5 sm:p-7">{children}</div>
  </section>
}
function fieldsFrom(item: Biografi): BiografiFields {
  return {
    namaPemilikKoleksi: item.namaPemilikKoleksi, email: item.email,
    phoneNumber: item.phoneNumber, alamat: item.alamat,
    hariMulai: item.hariMulai, hariSelesai: item.hariSelesai,
    jamBuka: item.jamBuka.slice(0, 5), jamTutup: item.jamTutup.slice(0, 5),
    instagram: item.instagram ?? '', facebook: item.facebook ?? '', youtube: item.youtube ?? '',
  }
}

function Photo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div className="grid aspect-square w-full place-items-center rounded-2xl bg-slate-100 text-xs text-slate-400">Foto tidak tersedia</div>
    : <img src={src} alt={`Foto ${name}`} onError={() => setFailed(true)} className="aspect-square w-full rounded-2xl object-cover ring-1 ring-slate-200/70" />
}

function ErrorNotice({ message, expired }: { message: string; expired: boolean }) {
  return <div role="alert" className="p-4 mb-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
    {message} {expired && <Link to="/admin/login" className="underline font-semibold">Login kembali</Link>}
  </div>
}

function BiografiForm({ initial, disabled, onCancel, onSaved, onSync }: {
  initial: Biografi | null
  disabled: boolean
  onCancel: () => void
  onSaved: (item: Biografi) => void
  onSync: (message: string) => void
}) {
  const [form, setForm] = useState<BiografiFields>(() => initial ? fieldsFrom(initial) : {
    namaPemilikKoleksi: '', email: '', phoneNumber: '', alamat: '',
    hariMulai: 'SENIN', hariSelesai: 'SABTU', jamBuka: '', jamTutup: '',
    instagram: '', facebook: '', youtube: '',
  })
  const [photo, setPhoto] = useState<File>()
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  function setField(key: keyof BiografiFields, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving || disabled) return
    const clean = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])) as unknown as BiografiFields
    const validation: Record<string, string> = {}
    if (errors.fotoProfil) validation.fotoProfil = errors.fotoProfil
    if (!initial && !photo) validation.fotoProfil = 'Foto profil wajib diunggah untuk profil baru.'
    for (const key of ['namaPemilikKoleksi', 'email', 'phoneNumber', 'alamat'] as const) {
      if (!clean[key]) validation[key] = 'Field ini wajib diisi.'
    }
    if (!/^\+?\d{8,15}$/.test(clean.phoneNumber)) validation.phoneNumber = 'Gunakan 8–15 digit, boleh diawali +, tanpa spasi.'
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(clean.jamBuka)) validation.jamBuka = 'Gunakan format HH:mm.'
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(clean.jamTutup) || clean.jamTutup <= clean.jamBuka) validation.jamTutup = 'Jam tutup harus sesudah jam buka pada hari yang sama.'
    for (const key of ['instagram', 'facebook', 'youtube'] as const) {
      if (!clean[key]) continue
      try {
        const url = new URL(clean[key])
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('URL')
      } catch { validation[key] = 'Masukkan URL http/https lengkap.' }
    }
    setErrors(validation)
    setError('')
    if (Object.keys(validation).length) {
      setError('Periksa kembali field yang ditandai.')
      return
    }
    const changes: Partial<BiografiFields> = {}
    const before = initial ? fieldsFrom(initial) : null
    for (const key of Object.keys(clean) as (keyof BiografiFields)[]) {
      if (!before || clean[key] !== before[key]) Object.assign(changes, { [key]: clean[key] })
    }
    if (!Object.keys(changes).length && !photo) {
      setError('Belum ada perubahan untuk disimpan.')
      return
    }
    setSaving(true)
    setExpired(false)
    try {
      const result = initial
        ? await biografiApi.update(changes, photo)
        : await biografiApi.create(clean, photo!)
      onSaved(result)
    } catch (err) {
      const failure = biografiError(err)
      if (failure.status === 409 || failure.status === 404) {
        onSync(failure.status === 409
          ? 'Profil sudah diisi oleh pengelola lain. Data terbaru dimuat; silakan periksa sebelum mengedit.'
          : 'Profil sudah tidak tersedia. Silakan isi profil awal kembali.')
        return
      }
      setError(!initial && !failure.status
        ? `${failure.message} Status penyimpanan belum dapat dipastikan. Buka kembali halaman ini sebelum mencoba mengirim ulang.`
        : failure.message)
      setErrors(failure.fields)
      setExpired(failure.status === 401)
      if (failure.status === 401) sessionStorage.removeItem('isLogin')
    } finally { setSaving(false) }
  }

  function textInput(key: keyof BiografiFields, label: string, type = 'text', maxLength?: number, required = true) {
    return <div key={key}>
      <label htmlFor={key} className={labelClass}>{label}{required && <span className="ml-1 text-red-500">*</span>}</label>
      <input id={key} type={type} value={form[key]} onChange={e => setField(key, e.target.value)}
        required={required} maxLength={maxLength} step={type === 'time' ? 60 : undefined}
        placeholder={key === 'namaPemilikKoleksi' ? 'Masukkan nama pemilik koleksi' : key === 'email' ? 'nama@email.com' : key === 'phoneNumber' ? 'Contoh: 081234567890' : type === 'url' ? `https://www.${key}.com/...` : undefined}
        aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} className={inputClass} />
      {errors[key] && <p id={`${key}-error`} className="text-red-600 text-xs mt-1">{errors[key]}</p>}
    </div>
  }

  return <form onSubmit={submit} aria-busy={saving}>
    {error && <ErrorNotice message={error} expired={expired} />}
    <fieldset disabled={saving || disabled} className="min-w-0 space-y-6">
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <FormSection title="Foto Profil" description="Identitas visual pemilik koleksi." icon="photo">
          <div className="mx-auto mb-5 max-w-56">
            {preview || initial?.fotoProfil
              ? <Photo key={preview || initial?.fotoProfil} src={preview || photoUrl(initial?.fotoProfil ?? '')} name={form.namaPemilikKoleksi} />
              : <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400"><Icon kind="user" className="h-12 w-12" /><span className="text-xs">Belum ada foto profil</span></div>}
          </div>
          <label htmlFor="fotoProfil" className={labelClass}>Unggah foto {!initial && <span className="text-red-500">*</span>}</label>
          <input ref={fileInput} id="fotoProfil" type="file" accept="image/jpeg,image/png,image/webp"
            aria-invalid={!!errors.fotoProfil} aria-describedby={`photo-help${errors.fotoProfil ? ' photo-error' : ''}`}
            onChange={event => {
              const file = event.target.files?.[0]
              setPhoto(undefined)
              setPreview('')
              let message = ''
              if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024)) {
                message = 'Gunakan gambar JPEG, PNG, atau WebP yang tidak kosong, maksimal 5 MiB.'
                if (fileInput.current) fileInput.current.value = ''
              } else {
                setPhoto(file)
                if (file) setPreview(URL.createObjectURL(file))
              }
              setErrors(prev => ({ ...prev, fotoProfil: message }))
            }} className="block w-full min-w-0 rounded-xl border border-slate-200 p-2 text-xs text-slate-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-600 hover:file:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-50" />
          <p id="photo-help" className="mt-3 text-xs leading-relaxed text-slate-400">JPEG, PNG, atau WebP. Maksimal 5 MiB. {initial ? 'Foto lama tetap digunakan jika tidak diganti.' : 'Wajib diunggah untuk profil baru.'}</p>
          {errors.fotoProfil && <p id="photo-error" className="mt-2 text-xs text-red-600">{errors.fotoProfil}</p>}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-xs font-semibold text-blue-700">Tips foto profil</p>
            <p className="mt-1 text-xs leading-relaxed text-blue-600/80">Gunakan foto yang jelas dengan pencahayaan baik agar pemilik koleksi mudah dikenali.</p>
          </div>
        </FormSection>

        <div className="min-w-0 space-y-6 xl:col-span-2">
          <FormSection title="Informasi Pemilik" description="Lengkapi identitas dan kontak pemilik koleksi." icon="user">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">{textInput('namaPemilikKoleksi', 'Nama pemilik koleksi', 'text', 255)}</div>
              {textInput('email', 'Email', 'email', 255)}
              {textInput('phoneNumber', 'Nomor telepon', 'tel', 16)}
              <div className="sm:col-span-2">
                <label htmlFor="alamat" className={labelClass}>Alamat <span className="ml-1 text-red-500">*</span></label>
                <textarea id="alamat" value={form.alamat} onChange={e => setField('alamat', e.target.value)} placeholder="Masukkan alamat lengkap koleksi" required maxLength={10000} rows={3} className={`${inputClass} resize-y`} aria-invalid={!!errors.alamat} aria-describedby={errors.alamat ? 'alamat-error' : undefined} />
                {errors.alamat && <p id="alamat-error" className="mt-1 text-xs text-red-600">{errors.alamat}</p>}
              </div>
            </div>
          </FormSection>

          <FormSection title="Jadwal Operasional" description="Atur hari dan jam kunjungan koleksi." icon="clock">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {(['hariMulai', 'hariSelesai'] as const).map(key => <div key={key}>
                <label htmlFor={key} className={labelClass}>{key === 'hariMulai' ? 'Hari mulai' : 'Hari selesai'} <span className="ml-1 text-red-500">*</span></label>
                <select id={key} value={form[key]} onChange={e => setField(key, e.target.value)} className={inputClass} required aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined}>
                  {HARI.map(day => <option key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</option>)}
                </select>
                {errors[key] && <p id={`${key}-error`} className="mt-1 text-xs text-red-600">{errors[key]}</p>}
              </div>)}
              {textInput('jamBuka', 'Jam buka', 'time')}
              {textInput('jamTutup', 'Jam tutup', 'time')}
            </div>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">Jam tutup harus setelah jam buka pada hari yang sama. Rentang hari dapat melewati akhir minggu.</p>
          </FormSection>

          <FormSection title="Media Sosial" description="Hubungkan pengunjung dengan kanal resmi koleksi. Opsional." icon="link">
            <div className="space-y-5">
              {textInput('instagram', 'Instagram', 'url', 2048, false)}
              {textInput('facebook', 'Facebook', 'url', 2048, false)}
              {textInput('youtube', 'YouTube', 'url', 2048, false)}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">Gunakan URL lengkap dengan https://. Kosongkan kolom untuk menghapus tautan yang tersimpan.</p>
          </FormSection>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-xs leading-relaxed text-slate-400"><span className="text-red-500">*</span> Wajib diisi. Pastikan informasi sudah benar sebelum menyimpan.</p>
        <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} className={`${buttonClass} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}>Batalkan Perubahan</button>
          <button type="submit" className={`${buttonClass} bg-blue-500 text-white shadow-sm shadow-blue-500/20 hover:bg-blue-600`}>
            {saving ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" /> : <Icon kind="save" className="h-4 w-4" />}
            {saving ? 'Menyimpan…' : initial ? 'Simpan Perubahan' : 'Simpan Profil'}
          </button>
        </div>
      </div>
    </fieldset>
  </form>
}

export default function BiografiManage() {
  const [profile, setProfile] = useState<Biografi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [success, setSuccess] = useState('')
  const [reload, setReload] = useState(0)
  const [formVersion, setFormVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    biografiApi.get(controller.signal).then(data => {
      if (!controller.signal.aborted) {
        setProfile(data)
        setError('')
        setExpired(false)
      }
    }).catch(err => {
      if (!controller.signal.aborted) {
        const failure = biografiError(err)
        if (failure.status === 404) {
          setProfile(null)
          setError('')
          setExpired(false)
          return
        }
        setError(failure.message)
        setExpired(failure.status === 401)
        if (failure.status === 401) sessionStorage.removeItem('isLogin')
      }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload])

  return <div className="mx-auto max-w-6xl pb-6 text-sm">
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Kelola Biografi</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">Kelola profil pemilik koleksi, informasi kontak, dan jadwal operasional.</p>
      </div>
      {!loading && !error && <span className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${profile ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-amber-100 bg-amber-50 text-amber-700'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${profile ? 'bg-blue-500' : 'bg-amber-500'}`} />
        {profile ? 'Edit profil' : 'Pengisian awal'}
      </span>}
    </div>
    {error && <ErrorNotice message={error} expired={expired} />}
    {success && <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="m5 12 4 4L19 6" /></svg>{success}
    </div>}
    {loading && <div role="status" className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-400"><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-slate-100 border-t-blue-500 motion-reduce:animate-none" />Menyiapkan form biografi…</div>}
    {!loading && !error && !profile && <p role="status" className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-700">Belum ada profil biografi. Lengkapi informasi di bawah dan unggah foto untuk membuat profil pertama.</p>}
    {!loading && !error && <BiografiForm key={`${profile?.id ?? 'profile'}-${reload}-${formVersion}`} initial={profile} disabled={false} onSync={message => {
      setLoading(true)
      setSuccess(message)
      setReload(value => value + 1)
    }} onCancel={() => {
      setFormVersion(value => value + 1)
      setSuccess('')
    }} onSaved={item => {
      setProfile(item)
      setFormVersion(value => value + 1)
      setSuccess(profile ? 'Profil berhasil diperbarui.' : 'Profil berhasil dibuat.')
    }} />}
  </div>
}
