import { useState, useRef, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

const KONDISI_LIST = ['Baik', 'Cukup Baik', 'Perlu Restorasi', 'Rusak']

interface FormState {
  noWayang: string
  nama: string
  daerah: string
  deskripsi: string
  cerita: string
  kondisi: string
}

export default function WayangCreate() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormState>({
    noWayang: '', nama: '', daerah: '', deskripsi: '', cerita: '', kondisi: '',
  })
  const [fileName, setFileName] = useState('')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)

  const set = (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const err: Partial<FormState> = {}
    if (!form.noWayang.trim()) err.noWayang = 'Nomor wayang wajib diisi.'
    if (!form.nama.trim()) err.nama = 'Nama wajib diisi.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      // 1. Buat data wayang
      const res = await api.post('/wayang', {
        noWayang: form.noWayang,
        nama: form.nama,
        daerah: form.daerah || undefined,
        deskripsi: form.deskripsi || undefined,
        cerita: form.cerita || undefined,
        kondisi: form.kondisi || undefined,
      })
      const wayangId: number = res.data.id

      // 2. Upload gambar kalau ada
      if (fileRef.current?.files?.[0]) {
        const body = new FormData()
        body.append('file', fileRef.current.files[0])
        body.append('judul', form.nama)
        body.append('jenisMedia', 'IMAGE')
        await api.post(`/wayang/${wayangId}/media`, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      navigate('/admin/dashboard')
    } catch {
      setErrors(prev => ({ ...prev, noWayang: 'Gagal menyimpan. Coba lagi.' }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tambah Wayang Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">No. Wayang <span className="text-red-400">*</span></label>
              <input value={form.noWayang} onChange={set('noWayang')} placeholder="cth. WYG-001"
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />
              {errors.noWayang && <p className="text-red-500 text-xs mt-1">{errors.noWayang}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama <span className="text-red-400">*</span></label>
              <input value={form.nama} onChange={set('nama')} placeholder="Nama tokoh wayang"
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Daerah Asal</label>
              <input value={form.daerah} onChange={set('daerah')} placeholder="cth. Solo, Yogyakarta"
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kondisi</label>
              <select value={form.kondisi} onChange={set('kondisi')}
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition bg-white">
                <option value="">Pilih Kondisi</option>
                {KONDISI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={set('deskripsi')} rows={3}
              placeholder="Deskripsi singkat tentang wayang ini…"
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-y" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Cerita</label>
            <textarea value={form.cerita} onChange={set('cerita')} rows={5}
              placeholder="Cerita atau latar belakang tokoh wayang…"
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-y" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Gambar</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Pilih Gambar
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
              </label>
              {fileName && <span className="text-slate-500 text-sm">{fileName}</span>}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="submit" disabled={submitting}
              className="px-6 py-[0.65rem] bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg cursor-pointer border-none transition-colors">
              {submitting ? 'Menyimpan…' : 'Simpan'}
            </button>
            <Link to="/admin/dashboard"
              className="px-6 py-[0.65rem] bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg no-underline transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
