import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const JENIS_LIST = ['Solo', 'Yogyakarta', 'Lainnya']
const BAHAN_LIST = ['Batu', 'Perunggu', 'Tanah Liat', 'Kayu', 'Logam', 'Lainnya']

export default function KoleksiCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: '', jenis: '', bahan: '', deskripsi: '' })
  const [fileName, setFileName] = useState('')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const set = (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name ?? '')
  }

  const validate = () => {
    const err: Partial<typeof form> = {}
    if (!form.nama.trim()) err.nama = 'Nama koleksi wajib diisi.'
    if (!form.jenis) err.jenis = 'Jenis wajib dipilih.'
    if (!form.bahan) err.bahan = 'Bahan wajib dipilih.'
    if (!form.deskripsi.trim()) err.deskripsi = 'Deskripsi wajib diisi.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    /* TODO: POST ke API backend */
    console.log('Create:', form)
    navigate('/admin/dashboard')
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tambah Koleksi Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Nama */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Koleksi</label>
            <input
              type="text"
              value={form.nama}
              onChange={set('nama')}
              placeholder="Masukkan nama koleksi"
              className="w-full px-4 py-3 text-[0.9rem] border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          {/* Jenis */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Jenis</label>
            <select
              value={form.jenis}
              onChange={set('jenis')}
              className="w-full px-4 py-3 text-[0.9rem] border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition bg-white"
            >
              <option value="">Pilih Jenis</option>
              {JENIS_LIST.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            {errors.jenis && <p className="text-red-500 text-xs mt-1">{errors.jenis}</p>}
          </div>

          {/* Bahan */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Bahan</label>
            <select
              value={form.bahan}
              onChange={set('bahan')}
              className="w-full px-4 py-3 text-[0.9rem] border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition bg-white"
            >
              <option value="">Pilih Bahan</option>
              {BAHAN_LIST.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.bahan && <p className="text-red-500 text-xs mt-1">{errors.bahan}</p>}
          </div>

          {/* Deskripsi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={set('deskripsi')}
              rows={4}
              placeholder="Masukkan deskripsi koleksi"
              className="w-full px-4 py-3 text-[0.9rem] border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-y"
            />
            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
          </div>

          {/* Gambar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Gambar</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Pilih Gambar
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              {fileName && <span className="text-slate-500 text-sm">{fileName}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="px-6 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer border-none transition-colors"
            >
              Simpan
            </button>
            <Link
              to="/admin/dashboard"
              className="px-6 py-[0.65rem] bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg no-underline transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
