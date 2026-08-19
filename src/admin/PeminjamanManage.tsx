import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

interface Peminjam {
  id: number
  namaPeminjam: string
  alamat: string
  noHp: string
}

interface WayangPeminjaman {
  id: number
  nama: string
}

interface Peminjaman {
  id: number
  peminjam: Peminjam
  wayang: WayangPeminjaman
  tanggalPinjam: string
  tanggalKembali: string
  keterangan?: string
  status: 'DIPINJAM' | 'DIKEMBALIKAN'
}

type StatusPeminjaman =
  | 'DIPINJAM'
  | 'TERLAMBAT'
  | 'DIKEMBALIKAN'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Statistics {
  totalPeminjaman: number
  totalPeminjam: number
  totalDipinjam: number
  totalDikembalikan: number
}

interface PeminjamanResponse {
  data: Peminjaman[]
  pagination: Pagination
  statistics: Statistics
}

export default function AdminPeminjaman() {
  const [peminjamanList, setPeminjamanList] =
    useState<Peminjaman[]>([])

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    })

  const [statistics, setStatistics] =
    useState<Statistics>({
      totalPeminjaman: 0,
      totalPeminjam: 0,
      totalDipinjam: 0,
      totalDikembalikan: 0,
    })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPeminjaman = async () => {
    try {
      setLoading(true)
      setError('')

      const params: {
        page: number
        limit: number
        search?: string
        status?: string
      } = {
        page: pagination.page,
        limit: pagination.limit,
      }

      if (search.trim()) {
        params.search = search.trim()
      }

      if (statusFilter) {
        params.status = statusFilter
      }

      const res = await api.get('/peminjaman', {
        params,
      })

      const result: PeminjamanResponse =
        res.data.data

      setPeminjamanList(result.data)
      setPagination(result.pagination)
      setStatistics(result.statistics)
    } catch (err) {
      console.error(err)

      setError(
        'Gagal memuat data peminjaman. Pastikan backend sudah berjalan.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPeminjaman()
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [
    pagination.page,
    pagination.limit,
    search,
    statusFilter,
  ])

  const handleSearch = (value: string) => {
    setSearch(value)

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const getStatus = (
    peminjaman: Peminjaman,
  ): StatusPeminjaman => {
    if (peminjaman.status === 'DIKEMBALIKAN') {
      return 'DIKEMBALIKAN'
    }

    const today = new Date()

    const tanggalKembali = new Date(
      peminjaman.tanggalKembali,
    )

    if (today > tanggalKembali) {
      return 'TERLAMBAT'
    }

    return 'DIPINJAM'
  }

  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    )
  }

  const getStatusStyle = (
    status: StatusPeminjaman,
  ) => {
    switch (status) {
      case 'DIPINJAM':
        return 'bg-blue-100 text-blue-700'

      case 'TERLAMBAT':
        return 'bg-red-100 text-red-700'

      case 'DIKEMBALIKAN':
        return 'bg-green-100 text-green-700'

      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus data peminjaman ini?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await api.delete(`/peminjaman/${id}`)

      if (
        peminjamanList.length === 1 &&
        pagination.page > 1
      ) {
        setPagination((prev) => ({
          ...prev,
          page: prev.page - 1,
        }))
      } else {
        fetchPeminjaman()
      }
    } catch (err) {
      console.error(err)

      setError(
        'Gagal menghapus data peminjaman.',
      )

      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }

  const handlePreviousPage = () => {
    if (pagination.page <= 1) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      page: prev.page - 1,
    }))
  }

  const handleNextPage = () => {
    if (
      pagination.page >=
      pagination.totalPages
    ) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
    }))
  }

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-red-50 text-red-800 border border-red-200">
          <svg
            width="18"
            height="18"
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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Kelola Peminjaman
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Peminjaman
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {statistics.totalPeminjaman}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                />
                <line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Peminjam
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {statistics.totalPeminjam}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Sedang Dipinjam
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {statistics.totalDipinjam}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line
                  x1="12"
                  y1="22.08"
                  x2="12"
                  y2="12"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Dikembalikan
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {statistics.totalDikembalikan}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="18"
            height="18"
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
            placeholder="Cari nama peminjam atau nomor HP..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none bg-white text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            handleStatusFilter(e.target.value)
          }
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white outline-none cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Semua Status
          </option>

          <option value="DIPINJAM">
            Dipinjam
          </option>

          <option value="TERLAMBAT">
            Terlambat
          </option>

          <option value="DIKEMBALIKAN">
            Dikembalikan
          </option>
        </select>

        <Link
          to="/admin/peminjaman/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg no-underline transition-colors whitespace-nowrap"
        >
          <svg
            width="16"
            height="16"
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

          Tambah Peminjam
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Memuat data…
          </div>
        ) : peminjamanList.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[
                      'No',
                      'Nama Peminjam',
                      'Wayang',
                      'Tanggal Pinjam',
                      'Tanggal Kembali',
                      'Status',
                      'Aksi',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {peminjamanList.map(
                    (
                      peminjaman,
                      idx,
                    ) => {
                      const status =
                        getStatus(
                          peminjaman,
                        )

                      const nomor =
                        (pagination.page -
                          1) *
                          pagination.limit +
                        idx +
                        1

                      return (
                        <tr
                          key={
                            peminjaman.id
                          }
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">
                            {nomor}
                          </td>

                          <td className="px-5 py-4 border-b border-slate-100">
                            <div className="text-[0.9rem] text-slate-800 font-medium">
                              {
                                peminjaman
                                  .peminjam
                                  .namaPeminjam
                              }
                            </div>

                            <div className="text-xs text-slate-400 mt-1">
                              {
                                peminjaman
                                  .peminjam
                                  .noHp
                              }
                            </div>
                          </td>

                          <td className="px-5 py-4 text-[0.9rem] text-slate-600 border-b border-slate-100">
                            {
                              peminjaman
                                .wayang
                                .nama
                            }
                          </td>

                          <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100 whitespace-nowrap">
                            {formatTanggal(
                              peminjaman
                                .tanggalPinjam,
                            )}
                          </td>

                          <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100 whitespace-nowrap">
                            {formatTanggal(
                              peminjaman
                                .tanggalKembali,
                            )}
                          </td>

                          <td className="px-5 py-4 border-b border-slate-100">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${getStatusStyle(
                                status,
                              )}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-5 py-4 border-b border-slate-100">
                            <div className="flex gap-2">
                              <Link
                                to={`/admin/peminjaman/${peminjaman.id}/edit`}
                                className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg no-underline transition-colors"
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
                                  className="mr-1.5"
                                >
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                </svg>

                                Edit
                              </Link>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    peminjaman.id,
                                  )
                                }
                                className="inline-flex items-center px-3 py-[0.4rem] bg-red-500 hover:bg-red-600 text-white text-[0.8rem] font-medium rounded-lg cursor-pointer border-none transition-colors"
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
                                  className="mr-1.5"
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100">
              <div className="text-sm text-slate-400">
                Menampilkan{' '}
                {(pagination.page - 1) *
                  pagination.limit +
                  1}
                {' - '}
                {Math.min(
                  pagination.page *
                    pagination.limit,
                  pagination.total,
                )}
                {' '}dari{' '}
                {pagination.total} data
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={
                    pagination.page === 1
                  }
                  onClick={
                    handlePreviousPage
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) => index + 1,
                )
                  .filter((page) => {
                    if (
                      pagination.totalPages <=
                      7
                    ) {
                      return true
                    }

                    if (page === 1) {
                      return true
                    }

                    if (
                      page ===
                      pagination.totalPages
                    ) {
                      return true
                    }

                    if (
                      page >=
                        pagination.page -
                          1 &&
                      page <=
                        pagination.page +
                          1
                    ) {
                      return true
                    }

                    return false
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
                            <span className="w-9 h-9 flex items-center justify-center text-sm text-slate-400">
                              ...
                            </span>
                          )}

                          <button
                            onClick={() =>
                              setPagination(
                                (
                                  prev,
                                ) => ({
                                  ...prev,
                                  page,
                                }),
                              )
                            }
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                              pagination.page ===
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

                <button
                  disabled={
                    pagination.page ===
                    pagination.totalPages
                  }
                  onClick={handleNextPage}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-3 text-slate-300">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                />
                <line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                />
              </svg>
            </div>

            <p className="text-slate-400 text-sm">
              {search || statusFilter
                ? 'Data peminjaman tidak ditemukan.'
                : 'Belum ada data peminjaman.'}
            </p>

            {!search &&
              !statusFilter && (
                <Link
                  to="/admin/peminjaman/create"
                  className="inline-block mt-4 text-sm text-blue-500 hover:text-blue-600 no-underline"
                >
                  Tambah peminjaman
                </Link>
              )}
          </div>
        )}
      </div>
    </>
  )
}