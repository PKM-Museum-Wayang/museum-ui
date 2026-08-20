import { useEffect, useMemo, useState } from 'react'

import api from '../lib/api'
import PenyimpananFormModal from './KotakCreate'
import KotakEdit from './KotakEdit'

interface KotakWayang {
  id: number
  namaKotak: string
  wayang: unknown[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function KotakManage() {
  const [kotakList, setKotakList] = useState<KotakWayang[]>([])

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchKotak = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await api.get('/penyimpanan')

      const data: KotakWayang[] =
        res.data.data?.data ??
        res.data.data ??
        []

      setKotakList(data)
    } catch (err) {
      console.error(err)

      setError(
        'Gagal memuat data penyimpanan. Pastikan backend sudah berjalan.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKotak()
  }, [])

  const filteredKotak = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return kotakList
    }

    return kotakList.filter((kotak) =>
      kotak.namaKotak.toLowerCase().includes(keyword),
    )
  }, [kotakList, search])

 
  const total = filteredKotak.length

  const totalPages =
    total === 0
      ? 0
      : Math.ceil(total / pagination.limit)

  const currentPage =
    totalPages > 0
      ? Math.min(pagination.page, totalPages)
      : 1

  const startIndex =
    (currentPage - 1) * pagination.limit

  const currentKotak = filteredKotak.slice(
    startIndex,
    startIndex + pagination.limit,
  )

  const handleSearch = (value: string) => {
    setSearch(value)

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      page: prev.page - 1,
    }))
  }

  const handleNextPage = () => {
    if (currentPage >= totalPages) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
    }))
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus penyimpanan ini?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await api.delete(`/penyimpanan/${id}`)

      setSuccessMsg(
        'Penyimpanan berhasil dihapus.',
      )

      setTimeout(() => {
        setSuccessMsg('')
      }, 3000)

      await fetchKotak()
    } catch (err) {
      console.error(err)

      setError('Gagal menghapus penyimpanan.')

      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }

  const handleModalSuccess = async () => {
    setShowModal(false)

    await fetchKotak()
  }

  const handleEditSuccess = async () => {
    setEditingId(null)

    await fetchKotak()
  }

  return (
    <div className="text-sm">

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[0.8rem] bg-red-50 text-red-800 border border-red-200">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
            />
            <line
              x1="12"
              y1="16"
              x2="12.01"
              y2="16"
            />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[0.8rem] bg-green-50 text-green-800 border border-green-200">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>

          <span>{successMsg}</span>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <PenyimpananFormModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* EDIT MODAL */}
      {editingId !== null && (
        <KotakEdit
          id={editingId}
          onClose={() => setEditingId(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* HEADER */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Kelola Kotak Penyimpanan
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Kelola tempat penyimpanan koleksi wayang
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              />

              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />
            </svg>

            Tambah Penyimpanan
          </button>
        </div>
      </div>

      {/* STATISTIC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 px-4 py-3.5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-slate-400">
                Total Penyimpanan
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {kotakList.length}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7h18" />
                <path d="M5 7v13h14V7" />
                <path d="M8 7V4h8v3" />
                <path d="M9 11h6" />
              </svg>

            </div>

          </div>

        </div>

      </div>

      {/* SEARCH + ADD */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-4">

        {/* SEARCH */}
        <div className="relative flex-1 min-w-0">

          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />

            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>

          <input
            type="text"
            placeholder="Cari nama penyimpanan..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none bg-white text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

        </div>

   

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-100">

        {loading ? (

          <div className="py-12 text-center text-slate-400 text-xs">
            Memuat data…
          </div>

        ) : currentKotak.length > 0 ? (

          <>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr>

                    {[
                      'No',
                      'Nama Penyimpanan',
                      'Jumlah Wayang',
                      'Aksi',
                    ].map((heading) => (

                      <th
                        key={heading}
                        className="bg-slate-50 px-3.5 py-2.5 text-left text-[0.68rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap"
                      >
                        {heading}
                      </th>

                    ))}

                  </tr>
                </thead>

                <tbody>

                  {currentKotak.map(
                    (kotak, idx) => {

                      const nomor =
                        (currentPage - 1) *
                          pagination.limit +
                        idx +
                        1

                      return (
                        <tr
                          key={kotak.id}
                          className="hover:bg-slate-50 transition-colors"
                        >

                          {/* NO */}
                          <td className="px-3.5 py-2.5 text-xs text-slate-500 border-b border-slate-100">
                            {nomor}
                          </td>

                          {/* NAMA */}
                          <td className="px-3.5 py-2.5 text-xs text-slate-800 border-b border-slate-100 font-medium">
                            {kotak.namaKotak}
                          </td>

                          {/* JUMLAH WAYANG */}
                          <td className="px-3.5 py-2.5 text-xs text-slate-500 border-b border-slate-100">

                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[0.65rem] font-medium">
                              {kotak.wayang.length} wayang
                            </span>

                          </td>

                          {/* AKSI */}
                          <td className="px-3.5 py-2.5 border-b border-slate-100">

                            <div className="flex gap-1.5">

                              {/* EDIT */}
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingId(
                                    kotak.id,
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[0.7rem] font-medium rounded-md cursor-pointer border-none transition-colors"
                              >

                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <path d="M12 20h9" />

                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                </svg>

                                Edit

                              </button>

                              {/* DELETE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    kotak.id,
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[0.7rem] font-medium rounded-md cursor-pointer border-none transition-colors"
                              >

                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <polyline points="3 6 5 6 21 6" />

                                  <path d="M19 6l-1 14H6L5 6" />

                                  <path d="M10 11v6" />

                                  <path d="M14 11v6" />

                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>

                                Hapus

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    },
                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-3 border-t border-slate-100">

              {/* INFO */}
              <div className="text-xs text-slate-400">

                Menampilkan{' '}

                {total > 0
                  ? startIndex + 1
                  : 0}

                {' - '}

                {Math.min(
                  startIndex +
                    pagination.limit,
                  total,
                )}

                {' '}dari {total} data

              </div>

              {/* BUTTON */}
              <div className="flex items-center gap-1">

                {/* PREVIOUS */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={
                    handlePreviousPage
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>

                </button>

                {/* PAGE NUMBER */}
                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1,
                )
                  .filter((page) => {

                    if (
                      totalPages <= 7
                    ) {
                      return true
                    }

                    if (
                      page === 1 ||
                      page === totalPages
                    ) {
                      return true
                    }

                    return (
                      page >=
                        currentPage - 1 &&
                      page <=
                        currentPage + 1
                    )
                  })
                  .map(
                    (
                      page,
                      index,
                      pages,
                    ) => {

                      const previousPage =
                        pages[index - 1]

                      const showEllipsis =
                        previousPage !==
                          undefined &&
                        page -
                          previousPage >
                          1

                      return (
                        <div
                          key={page}
                          className="flex items-center gap-1"
                        >

                          {showEllipsis && (
                            <span className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">
                              ...
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setPagination(
                                (prev) => ({
                                  ...prev,
                                  page,
                                }),
                              )
                            }
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-xs transition-colors ${
                              currentPage ===
                              page
                                ? 'bg-blue-500 text-white'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </button>

                        </div>
                      )
                    },
                  )}

                {/* NEXT */}
                <button
                  type="button"
                  disabled={
                    currentPage >=
                    totalPages
                  }
                  onClick={
                    handleNextPage
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>

                </button>

              </div>

            </div>

          </>

        ) : (

          /* EMPTY */
          <div className="py-10 text-center">

            <div className="flex justify-center mb-2 text-slate-300">

              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7h18" />
                <path d="M5 7v13h14V7" />
                <path d="M8 7V4h8v3" />
              </svg>

            </div>

            <p className="text-slate-400 text-xs">

              {search
                ? 'Data penyimpanan tidak ditemukan.'
                : 'Belum ada data penyimpanan.'}

            </p>

            {!search && (
              <button
                type="button"
                onClick={() =>
                  setShowModal(true)
                }
                className="inline-block mt-3 text-xs text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer"
              >
                Tambah penyimpanan
              </button>
            )}

          </div>

        )}

      </div>

    </div>
  )
}