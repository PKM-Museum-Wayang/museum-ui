import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { BASE_URL } from '../lib/api'

type TipeGolongan =
  | 'SIMPINGAN_KIRI'
  | 'SIMPINGAN_KANAN'
  | 'DUDHAHAN'

interface MediaWayang {
  id: number
  namaFile: string
  jenis: 'IMAGE' | 'VIDEO'
  fileUrl: string
  keterangan?: string
}

interface Wayang {
  id: number
  noWayang: string
  nama: string
  gaya?: string
  daerah?: string
  kondisi?: string
  golonganId: number
  penyimpananId: number
  createdAt: string
  updatedAt?: string
  media: MediaWayang[]
}

interface Golongan {
  id: number
  namaGolongan: string
  tipeGolongan: TipeGolongan
}

interface Penyimpanan {
  id: number
  namaKotak: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface WayangResponse {
  data: Wayang[]
  pagination: Pagination
  statistics?: {
    totalWayang: number
  }
}

export default function AdminDashboard() {
  const [wayangList, setWayangList] = useState<Wayang[]>([])

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const [golonganList, setGolonganList] = useState<Golongan[]>([])
  const [penyimpananList, setPenyimpananList] = useState<Penyimpanan[]>([])

  const [search, setSearch] = useState('')

  const [tipeGolonganFilter, setTipeGolonganFilter] =
    useState<TipeGolongan | ''>('')

  const [golonganFilter, setGolonganFilter] = useState('')
  const [penyimpananFilter, setPenyimpananFilter] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const normalizeTipeGolongan = (value: unknown): string => {
    return String(value ?? '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
  }

  const filteredGolongan = tipeGolonganFilter
    ? golonganList.filter((golongan) => {
        const tipe = normalizeTipeGolongan(
          golongan.tipeGolongan,
        )

        return tipe === tipeGolonganFilter
      })
    : []

  const fetchGolongan = async () => {
    try {
      const res = await api.get('/golongan/all')

      const data: Golongan[] = res.data.data ?? []

      setGolonganList(data)
    } catch (err) {
      console.error(err)
      setError('Gagal memuat data golongan.')
    }
  }

  const fetchPenyimpanan = async () => {
    try {
      const res = await api.get('/penyimpanan')

      const data: Penyimpanan[] =
        res.data.data?.data ??
        res.data.data ??
        []

      setPenyimpananList(data)
    } catch (err) {
      console.error(err)

      setError('Gagal memuat data penyimpanan.')
    }
  }

  useEffect(() => {
    fetchGolongan()
    fetchPenyimpanan()
  }, [])

  useEffect(() => {
    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        if (!cancelled) {
          setLoading(true)
          setError('')
        }

        const params: {
          page: number
          limit: number
          order: 'asc' | 'desc'
          search?: string
          tipeGolongan?: TipeGolongan
          golonganId?: number
          penyimpananId?: number
        } = {
          page: pagination.page,
          limit: pagination.limit,

          // Terbaru -> terlama
          order: 'desc',
        }

        if (search.trim()) {
          params.search = search.trim()
        }

        if (tipeGolonganFilter) {
          params.tipeGolongan = tipeGolonganFilter
        }

        if (golonganFilter) {
          params.golonganId = Number(golonganFilter)
        }

        if (penyimpananFilter) {
          params.penyimpananId = Number(
            penyimpananFilter,
          )
        }

        const res = await api.get('/wayang', {
          params,
        })

        if (cancelled) {
          return
        }

        const result: WayangResponse = res.data.data

        setWayangList(result.data)
        setPagination(result.pagination)
      } catch (err) {
        if (cancelled) {
          return
        }

        console.error(err)

        setError(
          'Gagal memuat data wayang. Pastikan backend sudah berjalan.',
        )

        setWayangList([])
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [
    pagination.page,
    pagination.limit,
    search,
    tipeGolonganFilter,
    golonganFilter,
    penyimpananFilter,
  ])

  const handleSearch = (value: string) => {
    setSearch(value)

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const handleTipeGolonganFilter = (
    value: TipeGolongan | '',
  ) => {
    setTipeGolonganFilter(value)

    setGolonganFilter('')

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const handleGolonganFilter = (
    value: string,
  ) => {
    setGolonganFilter(value)

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const handlePenyimpananFilter = (
    value: string,
  ) => {
    setPenyimpananFilter(value)

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus wayang ini?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await api.delete(`/wayang/${id}`)

      setSuccessMsg('Wayang berhasil dihapus.')

      setTimeout(() => {
        setSuccessMsg('')
      }, 3000)

      if (
        wayangList.length === 1 &&
        pagination.page > 1
      ) {
        setPagination((prev) => ({
          ...prev,
          page: prev.page - 1,
        }))

        return
      }

      const params: {
        page: number
        limit: number
        order: 'asc' | 'desc'
        search?: string
        tipeGolongan?: TipeGolongan
        golonganId?: number
        penyimpananId?: number
      } = {
        page: pagination.page,
        limit: pagination.limit,

        // Tetap terbaru -> terlama
        order: 'desc',
      }

      if (search.trim()) {
        params.search = search.trim()
      }

      if (tipeGolonganFilter) {
        params.tipeGolongan =
          tipeGolonganFilter
      }

      if (golonganFilter) {
        params.golonganId =
          Number(golonganFilter)
      }

      if (penyimpananFilter) {
        params.penyimpananId =
          Number(penyimpananFilter)
      }

      const res = await api.get('/wayang', {
        params,
      })

      const result: WayangResponse =
        res.data.data

      setWayangList(result.data)
      setPagination(result.pagination)
    } catch (err) {
      console.error(err)

      setError('Gagal menghapus wayang.')

      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }

  const getThumb = (
    media: MediaWayang[],
  ) => {
    const img = media?.find(
      (m) => m.jenis === 'IMAGE',
    )

    return img
      ? `${BASE_URL}${img.fileUrl}`
      : null
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
    <div className="text-sm">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
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

      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">
          Kelola Wayang
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Kelola data koleksi wayang
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">
                Total Wayang
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {pagination.total}
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
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-stretch gap-2.5 mb-4">
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
            <circle cx="11" cy="11" r="8" />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>

          <input
            type="text"
            placeholder="Cari nama wayang..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none bg-white text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={tipeGolonganFilter}
          onChange={(e) =>
            handleTipeGolonganFilter(
              e.target.value as
                | TipeGolongan
                | '',
            )
          }
          className="w-full xl:w-48 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white outline-none cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Semua Tipe Golongan
          </option>

          <option value="SIMPINGAN_KIRI">
            Simpingan Kiri
          </option>

          <option value="SIMPINGAN_KANAN">
            Simpingan Kanan
          </option>

          <option value="DUDHAHAN">
            Dudhahan
          </option>
        </select>

        <select
          value={golonganFilter}
          disabled={!tipeGolonganFilter}
          onChange={(e) =>
            handleGolonganFilter(
              e.target.value,
            )
          }
          className={`w-full xl:w-48 px-3 py-2 border rounded-lg text-xs outline-none transition ${
            !tipeGolonganFilter
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-600 border-slate-200 cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
          }`}
        >
          <option value="">
            {tipeGolonganFilter
              ? 'Semua Nama Golongan'
              : 'Pilih tipe golongan dulu'}
          </option>

          {filteredGolongan.map(
            (golongan) => (
              <option
                key={golongan.id}
                value={golongan.id}
              >
                {golongan.namaGolongan}
              </option>
            ),
          )}
        </select>

        <select
          value={penyimpananFilter}
          onChange={(e) =>
            handlePenyimpananFilter(
              e.target.value,
            )
          }
          className="w-full xl:w-48 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white outline-none cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Semua Penyimpanan
          </option>

          {penyimpananList.map(
            (penyimpanan) => (
              <option
                key={penyimpanan.id}
                value={penyimpanan.id}
              >
                {penyimpanan.namaKotak}
              </option>
            ),
          )}
        </select>

        <Link
          to="/admin/wayang/create"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg no-underline transition-colors whitespace-nowrap"
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

          Tambah Wayang
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Memuat data…
          </div>
        ) : wayangList.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[
                      'No',
                      'Gambar',
                      'No. Wayang',
                      'Nama',
                      'Daerah',
                      'Kondisi',
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
                  {wayangList.map(
                    (wayang, idx) => {
                      const thumb =
                        getThumb(
                          wayang.media,
                        )

                      const nomor =
                        (pagination.page - 1) *
                          pagination.limit +
                        idx +
                        1

                      return (
                        <tr
                          key={wayang.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-3.5 py-2.5 text-xs text-slate-500 border-b border-slate-100">
                            {nomor}
                          </td>

                          <td className="px-3.5 py-2.5 border-b border-slate-100">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={wayang.nama}
                                className="w-11 h-11 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-11 h-11 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-[0.55rem]">
                                No img
                              </div>
                            )}
                          </td>

                          <td className="px-3.5 py-2.5 text-xs text-slate-500 border-b border-slate-100 font-mono whitespace-nowrap">
                            {wayang.noWayang}
                          </td>

                          <td className="px-3.5 py-2.5 text-xs text-slate-800 border-b border-slate-100 font-medium">
                            {wayang.nama}
                          </td>

                          <td className="px-3.5 py-2.5 text-xs text-slate-500 border-b border-slate-100">
                            {wayang.daerah ?? '—'}
                          </td>

                          <td className="px-3.5 py-2.5 border-b border-slate-100">
                            {wayang.kondisi ? (
                              <span className="bg-green-100 text-green-700 text-[0.65rem] font-medium px-1.5 py-0.5 rounded">
                                {wayang.kondisi}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[0.65rem]">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-3.5 py-2.5 border-b border-slate-100">
                            <div className="flex gap-1.5">
                              <Link
                                to={`/admin/wayang/${wayang.id}/edit`}
                                className="inline-flex items-center px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[0.7rem] font-medium rounded-md no-underline transition-colors"
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
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    wayang.id,
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-3 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                Menampilkan{' '}
                {(pagination.page - 1) *
                  pagination.limit +
                  1}{' '}
                -{' '}
                {Math.min(
                  pagination.page *
                    pagination.limit,
                  pagination.total,
                )}{' '}
                dari {pagination.total} data
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={
                    pagination.page === 1
                  }
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

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) =>
                    index + 1,
                )
                  .filter((page) => {
                    if (
                      pagination.totalPages <=
                      7
                    ) {
                      return true
                    }

                    if (
                      page === 1 ||
                      page ===
                        pagination.totalPages
                    ) {
                      return true
                    }

                    return (
                      page >=
                        pagination.page - 1 &&
                      page <=
                        pagination.page + 1
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
                  type="button"
                  disabled={
                    pagination.page >=
                    pagination.totalPages
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
                <path d="M12 2C8 5 5 8 5 13a7 7 0 0 0 14 0c0-5-3-8-7-11Z" />
                <path d="M9 17c1.5 1 4.5 1 6 0" />
              </svg>
            </div>

            <p className="text-slate-400 text-xs">
              {search ||
              tipeGolonganFilter ||
              golonganFilter ||
              penyimpananFilter
                ? 'Data wayang tidak ditemukan.'
                : 'Belum ada data wayang.'}
            </p>

            {!search &&
              !tipeGolonganFilter &&
              !golonganFilter &&
              !penyimpananFilter && (
                <Link
                  to="/admin/wayang/create"
                  className="inline-block mt-3 text-xs text-blue-500 hover:text-blue-600 no-underline"
                >
                  Tambah wayang
                </Link>
              )}
          </div>
        )}
      </div>
    </div>
  )
}