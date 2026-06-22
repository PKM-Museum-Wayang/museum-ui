import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Koleksi {
  id: number
  nama: string
  jenis: string
  bahan: string
  gambar?: string
}

/* Mock data — ganti dengan fetch ke API saat backend siap */
const MOCK: Koleksi[] = [
  { id: 1, nama: 'Arjuna', jenis: 'Solo', bahan: 'Kulit Kerbau' },
  { id: 2, nama: 'Bima', jenis: 'Solo', bahan: 'Kulit Kerbau' },
  { id: 3, nama: 'Kresna', jenis: 'Yogyakarta', bahan: 'Kulit Kerbau' },
  { id: 4, nama: 'Srikandi', jenis: 'Yogyakarta', bahan: 'Kulit Kerbau' },
  { id: 5, nama: 'Gatotkaca', jenis: 'Solo', bahan: 'Kulit Kerbau' },
]

export default function AdminDashboard() {
  const [koleksis, setKoleksis] = useState<Koleksi[]>(MOCK)
  const [successMsg, setSuccessMsg] = useState('')

  const handleDelete = (id: number) => {
    if (!window.confirm('Yakin ingin menghapus koleksi ini?')) return
    setKoleksis(prev => prev.filter(k => k.id !== id))
    setSuccessMsg('Koleksi berhasil dihapus.')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <>
      {successMsg && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-green-50 text-green-800 border border-green-200">
          ✓ {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-1">Total Koleksi: {koleksis.length}</p>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Koleksi</h1>
        </div>
        <Link
          to="/admin/koleksi/create"
          className="inline-flex items-center gap-2 px-5 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg no-underline transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Koleksi
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {koleksis.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['No', 'Gambar', 'Nama', 'Jenis', 'Bahan', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {koleksis.map((k, idx) => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-[0.9rem] text-slate-600 border-b border-slate-100">{idx + 1}</td>
                  <td className="px-5 py-4 border-b border-slate-100">
                    {k.gambar ? (
                      <img src={k.gambar} alt={k.nama} className="w-[60px] h-[60px] object-cover rounded-lg" />
                    ) : (
                      <div className="w-[60px] h-[60px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[0.65rem]">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[0.9rem] text-slate-700 border-b border-slate-100 font-medium">{k.nama}</td>
                  <td className="px-5 py-4 text-[0.9rem] text-slate-600 border-b border-slate-100">{k.jenis}</td>
                  <td className="px-5 py-4 text-[0.9rem] text-slate-600 border-b border-slate-100">{k.bahan}</td>
                  <td className="px-5 py-4 border-b border-slate-100">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">Aktif</span>
                  </td>
                  <td className="px-5 py-4 border-b border-slate-100">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/koleksi/${k.id}/edit`}
                        className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg no-underline transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="inline-flex items-center px-3 py-[0.4rem] bg-red-500 hover:bg-red-600 text-white text-[0.8rem] font-medium rounded-lg cursor-pointer border-none transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-400">
            Belum ada koleksi. Klik "Tambah Koleksi" untuk menambahkan.
          </div>
        )}
      </div>
    </>
  )
}
