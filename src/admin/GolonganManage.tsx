import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import api from '../lib/api'
import GolonganFormModal from "./GolonganCreate"

interface GolonganWayang {
  id: number
  namaGolongan: string
  tipeGolongan: string
  _count: { wayang: number }
}

export default function GolonganManage() {
  const [GolonganList, SetGolonganList] = useState<GolonganWayang[]>([])
  const [Loading, SetLoading] = useState(true)
  const [showModal, SetShowModal] = useState(false)
  const [Error, SetError] = useState('')

  const fetchGolongan = async () => {
    try {
      SetLoading(true)
      const getdata = await api.get('golongan')
      SetGolonganList(getdata.data.data)
    } catch {
      SetError('Gagal memuat data. Cek Backend sudah jalan di port 3000 atau belum.')
    } finally {
      SetLoading(false)
    }
  }

  const handleDelete = async (id:number) => {
    if(!window.confirm('Yakin ingin menghapus golongan ini?')) return
    try {
      await api.delete(`golongan/${id}`)
      SetGolonganList(prev => prev.filter(g => g.id !== id))
    } catch {
      SetError('Gagal menghapus.')
      setTimeout(() => SetError(''), 3000)
    }
  }

  useEffect(() => { fetchGolongan() }, [])

  return (
    <>
      {Error && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-red-50 text-red-800 border border-red-200">
          ✗ {Error}
        </div>
      )}

      {showModal && (
        <GolonganFormModal 
        onclose={() => SetShowModal(false)}
        onSuccess={fetchGolongan}/>
      )}

      <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kelola Golongan</h1>
      </div>
        <button onClick={() => SetShowModal(true)} className="inline-flex items-center gap-2 px-5 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg no-underline transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Golongan
        </button>
      </div>

      {/* div buat tabel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {Loading ? (
          <div className="py-16 text-center text-slate-400">Memuat data…</div>
        ) : GolonganList.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['No', 'Nama Golongan', 'Tipe Golongan', 'Jumlah Wayang', 'Aksi'].map(h=> (
                  <th key={h} className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {GolonganList.map((g, idx) => {
                return (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{idx + 1}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{g.namaGolongan}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{g.tipeGolongan}</td>
                    <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{g._count.wayang}</td>
                    <td className="px-5 py-4 border-b border-slate-100">
                      <div className="flex gap-2">
                        <Link
                        to={`/admin/golongan/${g.id}/edit`}
                        className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg no-underline transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                        onClick={() => handleDelete(g.id)}
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
            Belum ada data. Klik "Tambah Golongan" untuk menambahkan.
          </div>
        )}
      </div>
    </>
  )
}
