import { useState, type ChangeEvent, type FormEvent } from 'react'
import api from '../lib/api'

interface KegiatanFormModalProps {
  onClose: () => void
  onSuccess: () => void
}

interface FormState {
  nama: string
  tanggal: string
  jam: string
  lokasi: string
  deskripsi: string
}

export default function KegiatanFormModal({ onClose, onSuccess }: KegiatanFormModalProps) {
  const [form, setForm] = useState<FormState>({
    nama: '',
    tanggal: '',
    jam: '',
    lokasi: '',
    deskripsi: '',
  })

  const [file, setFile] = useState<File[]>([])
  const [previewUrl, setPreviewUrl] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const set = (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return
    setFile(prev => [...prev, ...selected])
    setPreviewUrl(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))])
  }

  const removeFile = (idx: number) => {
    setFile(prev => prev.filter((_, i) => i !== idx))
    setPreviewUrl(prev => prev.filter((_, i) => i !== idx))
  }

  const validate = () => {
    const err: Partial<Record<keyof FormState, string>> = {}
    if (!form.nama.trim()) err.nama = 'Nama kegiatan wajib diisi.'
    if (!form.tanggal) err.tanggal = 'Tanggal wajib diisi.'
    if (!form.jam) err.jam = 'Jam wajib diisi.'
    if (!form.lokasi.trim()) err.lokasi = 'Lokasi wajib diisi.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    // TODO: adminId belum ada sumber resminya di frontend — sementara
    // dibaca dari sessionStorage. Pastikan proses login kamu menyimpan
    // id admin ke key 'adminId' setelah berhasil login, kalau belum.
    const adminId = Number(sessionStorage.getItem('adminId'))

    if (!adminId) {
      setError('ID admin tidak ditemukan. Silakan login ulang.')
      return
    }

    setSubmitting(true)
    try {
      const tanggalIso = new Date(`${form.tanggal}T${form.jam}`).toISOString()

      const res = await api.post('/kegiatan', {
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || undefined,
        tanggal: tanggalIso,
        lokasi: form.lokasi.trim(),
        adminId,
      })

      const kegiatanId = res.data?.data?.id

      if (file.length > 0 && kegiatanId) {
        for (const f of file) {
          const b = new FormData()
          b.append('file', f)
          await api.post(`/kegiatan/${kegiatanId}/gambar`, b, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      }

      onSuccess()
    } catch {
      setError('Gagal menyimpan kegiatan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* COVER GAMBAR + NAMA */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(155deg, #78350f 0%, #b45309 55%, #f59e0b 100%)' }}
          />

          <div className="flex flex-wrap gap-3 mt-3">
            {previewUrl.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <button type='button' onClick={() => removeFile(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs border-none cursor-pointer"
                  >
                    ×
                  </button>
              </div>
            ))}
          </div>

          {/* {previewUrl && (
            <img src={previewUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )} */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-slate-900/10" />

          <label className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-white/95 text-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {file.length > 0 ? 'Ganti Gambar' : 'Pilih Gambar'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="absolute left-6 right-6 bottom-5">
            <input
              value={form.nama}
              onChange={set('nama')}
              placeholder="Nama kegiatan"
              className="w-full bg-transparent text-2xl font-extrabold text-white placeholder:text-white/50 outline-none border-none tracking-tight"
            />
            {errors.nama && <p className="text-xs text-red-300 mt-1">{errors.nama}</p>}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6">

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Lokasi <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                value={form.lokasi}
                onChange={set('lokasi')}
                placeholder="cth. Kampus II USD · Aula Driyarkara"
                className="flex-1 outline-none border-none bg-transparent"
              />
            </div>
            {errors.lokasi && <p className="text-red-500 text-xs mt-1">{errors.lokasi}</p>}
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tanggal <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={form.tanggal}
                onChange={set('tanggal')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none"
              />
              {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Jam <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="time"
                value={form.jam}
                onChange={set('jam')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none"
              />
              {errors.jam && <p className="text-red-500 text-xs mt-1">{errors.jam}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Deskripsi <span className="text-[11px] font-normal text-slate-400">Opsional</span>
            </label>
            <textarea
              rows={4}
              value={form.deskripsi}
              onChange={set('deskripsi')}
              placeholder="Ceritakan kegiatan ini kepada pengunjung..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold border-none cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {submitting ? 'Menyimpan…' : 'Simpan Kegiatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
