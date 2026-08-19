import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import api, { BASE_URL } from '../lib/api' 
import PenyimpananFormModal from "./KotakCreate"
import KotakEdit from "./KotakEdit"

  interface kotakWayang {
    id: number
    namaKotak: string
    wayang: unknown[]
  }

export default function KotakManage() {
  const [KotakList, SetKotakList] = useState<kotakWayang[]>([])
  const [Loading, SetLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchKotak = async () => {
    try {
      SetLoading(true)
      const kotaks = await api.get('penyimpanan')
      SetKotakList(kotaks.data.data)
    } catch {
      setError('Gagal memuat data. Cek Backend sudah jalan di port 300 atau belum.')
    } finally {
      SetLoading(false)
    }
  }

  const handleDelete = async (id:number) => {
    if(!window.confirm('Yakin ingin menghapus golongan ini?')) return
    try {
      await api.delete(`penyimpanan/${id}`)
      SetKotakList(prev => prev.filter( p => p.id !== id))
    } catch {
      setError('Gagal menghapus.')
      setTimeout(() => setError(''), 3000)
    }
  }

  useEffect(() => { fetchKotak() }, [])

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-red-50 text-red-800 border border-red-200">
          ✗ {error}
        </div>
      )}

      {showModal && (
        <PenyimpananFormModal
        onClose={() => setShowModal(false)}
        onSuccess={fetchKotak}/>
      )}

      {editingId !== null && (
  <KotakEdit
    id={editingId}
    onClose={() => setEditingId(null)}
    onSuccess={fetchKotak}
  />
)}

      <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kelola Kotak Penyimpanan</h1>
      </div>

      <button onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-5 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg no-underline transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Tambah Penyimpanan
      </button>

      </div>

      {/* div buat tabel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* loading memuat data */}     
        {Loading ? (
          <div className="py-16 text-center text-slate-400">Memuat data…</div>
        ) : KotakList.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['No', 'Nama Penyimpanan', 'Jumlah Wayang', 'Aksi'].map(h => (
                  <th key={h} className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {KotakList.map((k, idx) => {
                return (
                  <tr key={k.id} className="hover:bg-namaKotakslate-50 transition-colors">
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{idx + 1}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-800 border-b border-slate-100 font-medium">{k.namaKotak}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{k.wayang.length}</td>
                    <td className="px-5 py-4 border-b border-slate-100">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingId(k.id)}
                        className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg cursor-pointer border-none transition-colors">
                          Edit
                          </button>
                        <button
                        onClick={() => handleDelete(k.id)}
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
        ): (
          <div className="py-12 text-center text-slate-400">
            Belum ada data. Klik "Tambah Penyimpanan" untuk menambahkan.
          </div>
        )}
      </div>
    </>
  )
}
