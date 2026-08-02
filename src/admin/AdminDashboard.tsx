import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { BASE_URL } from '../lib/api'

interface MediaWayang {
  id: number
  judul: string
  jenisMedia: 'IMAGE' | 'VIDEO'
  fileUrl: string
  keterangan?: string
}

interface Wayang {
  id: number
  noWayang: string
  nama: string
  daerah?: string
  kondisi?: string
  media: MediaWayang[]
}

export default function AdminDashboard() {
  const [wayangList, setWayangList] = useState<Wayang[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const fetchWayang = async () => {
    try {
      setLoading(true)
      const res = await api.get<Wayang[]>('/wayang')
      setWayangList(res.data)
    } catch {
      setError('Gagal memuat data. Pastikan backend sudah berjalan di port 3000.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWayang() }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus wayang ini?')) return
    try {
      await api.delete(`/wayang/${id}`)
      setWayangList(prev => prev.filter(w => w.id !== id))
      setSuccessMsg('Wayang berhasil dihapus.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setError('Gagal menghapus.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const getThumb = (media: MediaWayang[]) => {
    const img = media.find(m => m.jenisMedia === 'IMAGE')
    return img ? `${BASE_URL}${img.fileUrl}` : null
  }

  return (
    <>
      {successMsg && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-green-50 text-green-800 border border-green-200">
          ✓ {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-red-50 text-red-800 border border-red-200">
          ✗ {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-1">Total: {wayangList.length} wayang</p>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Wayang</h1>
        </div>
        <Link
          to="/admin/wayang/create"
          className="inline-flex items-center gap-2 px-5 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg no-underline transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Wayang
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Memuat data…</div>
        ) : wayangList.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['No', 'Gambar', 'No. Wayang', 'Nama', 'Daerah', 'Kondisi', 'Aksi'].map(h => (
                  <th key={h} className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wayangList.map((w, idx) => {
                const thumb = getThumb(w.media)
                return (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{idx + 1}</td>
                    <td className="px-5 py-4 border-b border-slate-100">
                      {thumb ? (
                        <img src={thumb} alt={w.nama} className="w-[60px] h-[60px] object-cover rounded-lg" />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[0.65rem]">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100 font-mono">{w.noWayang}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-800 border-b border-slate-100 font-medium">{w.nama}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{w.daerah ?? '—'}</td>
                    <td className="px-5 py-4 border-b border-slate-100">
                      {w.kondisi ? (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">{w.kondisi}</span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 border-b border-slate-100">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/wayang/${w.id}/edit`}
                          className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg no-underline transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(w.id)}
                          className="inline-flex items-center px-3 py-[0.4rem] bg-red-500 hover:bg-red-600 text-white text-[0.8rem] font-medium rounded-lg cursor-pointer border-none transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-400">
            Belum ada data. Klik "Tambah Wayang" untuk menambahkan.
          </div>
        )}
      </div>
    </>
  )
}
