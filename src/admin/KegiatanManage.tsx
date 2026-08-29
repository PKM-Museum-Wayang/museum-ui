import { useEffect, useState } from "react"
import axios from 'axios'
import api, { BASE_URL } from '../lib/api'
import KegiatanFormModal from './KegiatanCreate'
import KegiatanEditModal from './KegiatanEdit'

interface KegiatanItem {
  id: number
  nama: string
  deskripsi?: string | null
  tanggal: string
  lokasi: string
  gambar: { id: number; fileUrl: string }[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface KegiatanResponse {
  data: KegiatanItem[]
  pagination: Pagination
}

const formatTanggal = (iso: string) => {
  const tanggal = new Date(iso)

  const tanggalLabel = tanggal.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const jamLabel = tanggal.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${tanggalLabel}, ${jamLabel} WIB`
}

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
    return err.response.data.message
  }

  return fallback
}

export default function KegiatanManage() {
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>([])

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchKegiatan = async () => {
    try {
      setLoading(true)
      setError('')

      const params: { page: number; limit: number; search?: string } = {
        page: pagination.page,
        limit: pagination.limit,
      }

      if (search.trim()) {
        params.search = search.trim()
      }

      const res = await api.get('/kegiatan', { params })

      const result: KegiatanResponse = res.data.data

      setKegiatanList(result.data)
      setPagination(result.pagination)
    } catch (err) {
      console.error(err)

      setError(getErrorMessage(err, 'Gagal memuat data kegiatan. Pastikan backend sudah berjalan.'))

     setKegiatanList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKegiatan()
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, search])

  const handleSearch = (value: string) => {
    setSearch(value)

    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Yakin ingin menghapus kegiatan ini?')

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await api.delete(`/kegiatan/${id}`)

      setSuccessMsg('Kegiatan berhasil dihapus.')

      setTimeout(() => setSuccessMsg(''), 3000)

      if (kegiatanList.length === 1 && pagination.page > 1) {
        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
      } else {
        fetchKegiatan()
      }
    } catch (err) {
      console.error(err)

      setError(getErrorMessage(err, 'Gagal menghapus kegiatan.'))

      setTimeout(() => setError(''), 3000)
    }
  }

  const handlePreviousPage = () => {
    if (pagination.page <= 1) {
      return
    }

    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
  }

  const handleNextPage = () => {
    if (pagination.page >= pagination.totalPages) {
      return
    }

    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
  }

    return(
        <div className="text-sm">

      {showModal && (
        <KegiatanFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchKegiatan()
          }}
        />
      )}            

      {editingId !== null && (
        <KegiatanEditModal
          id={editingId}
          onClose={() => setEditingId(null)}
          onSuccess={() => {
            setEditingId(null)
            fetchKegiatan()
          }}
        />
      )}

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[0.8rem] bg-red-50 text-red-800 border border-red-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[0.8rem] bg-green-50 text-green-800 border border-green-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

            <div className="mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Kelola Kegiatan
                        </h1>

                        <p className="text-xs text-slate-400 mt-1">
                            Kelola Kegiatan
                        </p>
                    </div>

                    <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Tambah Kegiatan
                    </button>
                </div>
            </div>

      {/* SEARCH */}
      <div className="relative mb-6 max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Cari nama, lokasi, atau deskripsi kegiatan..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none bg-white text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

     {/* TABEL */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Memuat data…</div>
        ) : kegiatanList.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['No', 'Gambar', 'Nama Kegiatan', 'Tanggal & Jam', 'Lokasi', 'Aksi'].map((h) => (
                      <th key={h} className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {kegiatanList.map((k, idx) => {
                    const nomor = (pagination.page - 1) * pagination.limit + idx + 1

                    return (
                      <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">{nomor}</td>

                        <td className="px-5 py-4 border-b border-slate-100">
                          {k.gambar.length > 0 ? (
                            <img
                              src={`${BASE_URL}${k.gambar[0].fileUrl}`}
                              alt={k.nama}
                              className="w-11 h-11 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-11 h-11 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-[0.55rem]">
                              No img
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-[0.9rem] text-slate-800 font-medium border-b border-slate-100">
                          {k.nama}
                        </td>

                        <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100 whitespace-nowrap">
                          {formatTanggal(k.tanggal)}
                        </td>

                        <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">
                          {k.lokasi}
                        </td>

                        <td className="px-5 py-4 border-b border-slate-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingId(k.id)}
                              className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg cursor-pointer border-none transition-colors"
                            >
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
            </div>
            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pagination.page === 1}
                  onClick={handlePreviousPage}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                                <span className="px-3 text-xs text-slate-500">
                  Halaman {pagination.page} dari {Math.max(pagination.totalPages, 1)}
                </span>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={handleNextPage}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-400">
            {search ? 'Kegiatan tidak ditemukan.' : 'Belum ada kegiatan. Klik "Tambah Kegiatan" untuk menambahkan.'}
          </div>
        )}
      </div>
        </div>
    )
}