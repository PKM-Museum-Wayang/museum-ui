import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Wayang {
  id: number
  nama: string
  noWayang?: string
}

interface Kotak {
  id: number
  namaKotak: string
}

interface FormData {
  namaPeminjam: string
  alamat: string
  noHp: string
  wayangId: string
  penyimpananId: string
  tanggalPinjam: string
  tanggalKembali: string
  keterangan: string
}

interface ApiErrorResponse {
  success?: boolean
  statusCode?: number
  message?: string | string[]
  error?: string
}

interface AxiosErrorLike {
  response?: {
    data?: ApiErrorResponse
    status?: number
  }
  message?: string
}

type AssetType = 'wayang' | 'kotak'

const isAxiosErrorLike = (
  error: unknown,
): error is AxiosErrorLike => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  return 'response' in error || 'message' in error
}

export default function AdminPeminjamanCreate() {
  const navigate = useNavigate()

  const [assetType, setAssetType] =
    useState<AssetType>('wayang')

  const [wayangList, setWayangList] =
    useState<Wayang[]>([])

  const [kotakList, setKotakList] =
    useState<Kotak[]>([])



  const [selectedWayang, setSelectedWayang] =
    useState<Wayang | null>(null)

  const [selectedKotak, setSelectedKotak] =
    useState<Kotak | null>(null)



  const [searchWayang, setSearchWayang] =
    useState('')

  const [searchKotak, setSearchKotak] =
    useState('')

  const [loadingSearch, setLoadingSearch] =
    useState(false)

  const [hasSearchedWayang, setHasSearchedWayang] =
    useState(false)

  const [hasSearchedKotak, setHasSearchedKotak] =
    useState(false)


  const [formData, setFormData] =
    useState<FormData>({
      namaPeminjam: '',
      alamat: '',
      noHp: '',
      wayangId: '',
      penyimpananId: '',
      tanggalPinjam: '',
      tanggalKembali: '',
      keterangan: '',
    })


  const [loadingSubmit, setLoadingSubmit] =
    useState(false)

  const [error, setError] =
    useState<string>('')



  const searchWayangData = async () => {
    try {
      setLoadingSearch(true)
      setError('')

      const keyword = searchWayang.trim()

      const params: {
        page: number
        limit: number
        search?: string
      } = {
        page: 1,
        limit: 20,
      }

      if (keyword) {
        params.search = keyword
      }

      const res = await api.get('/wayang', {
        params,
      })

      console.log(
        'Response pencarian wayang:',
        res.data,
      )

      const data =
        res.data?.data?.data ??
        res.data?.data

      if (Array.isArray(data)) {
        setWayangList(data)
      } else {
        setWayangList([])
        setError(
          'Format data wayang dari server tidak sesuai.',
        )
      }

      setHasSearchedWayang(true)
    } catch (err: unknown) {
      console.error(
        'Search wayang error:',
        err,
      )

      setWayangList([])
      setHasSearchedWayang(true)

      setError(
        getErrorMessage(
          err,
          'Gagal mencari data wayang.',
        ),
      )
    } finally {
      setLoadingSearch(false)
    }
  }



  const searchKotakData = async () => {
    try {
      setLoadingSearch(true)
      setError('')

      const keyword = searchKotak.trim()

      const params: {
        page: number
        limit: number
        search?: string
      } = {
        page: 1,
        limit: 20,
      }

      if (keyword) {
        params.search = keyword
      }

      const res = await api.get('/penyimpanan', {
        params,
      })

      console.log(
        'Response pencarian kotak:',
        res.data,
      )

      const data =
        res.data?.data?.data ??
        res.data?.data

      if (Array.isArray(data)) {
        setKotakList(data)
      } else {
        setKotakList([])
        setError(
          'Format data kotak dari server tidak sesuai.',
        )
      }

      setHasSearchedKotak(true)
    } catch (err: unknown) {
      console.error(
        'Search kotak error:',
        err,
      )

      setKotakList([])
      setHasSearchedKotak(true)

      setError(
        getErrorMessage(
          err,
          'Gagal mencari data kotak.',
        ),
      )
    } finally {
      setLoadingSearch(false)
    }
  }



  const handleSelectWayang = (
    wayang: Wayang,
  ) => {
    setSelectedWayang(wayang)

    setFormData((prev) => ({
      ...prev,
      wayangId: String(wayang.id),
      penyimpananId: '',
    }))

    setError('')
  }



  const handleSelectKotak = (
    kotak: Kotak,
  ) => {
    setSelectedKotak(kotak)

    setFormData((prev) => ({
      ...prev,
      penyimpananId: String(kotak.id),
      wayangId: '',
    }))

    setError('')
  }



  const handleAssetTypeChange = (
    type: AssetType,
  ) => {
    setAssetType(type)

    setError('')

    setWayangList([])
    setKotakList([])

    setHasSearchedWayang(false)
    setHasSearchedKotak(false)

    setSearchWayang('')
    setSearchKotak('')


    setSelectedWayang(null)
    setSelectedKotak(null)


    setFormData((prev) => ({
      ...prev,
      wayangId: '',
      penyimpananId: '',
    }))
  }



  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }


  const validateForm = (): boolean => {
    if (!formData.namaPeminjam.trim()) {
      setError(
        'Nama peminjam wajib diisi.',
      )

      return false
    }

    if (!formData.alamat.trim()) {
      setError(
        'Alamat wajib diisi.',
      )

      return false
    }

    if (!formData.noHp.trim()) {
      setError(
        'Nomor HP wajib diisi.',
      )

      return false
    }


    if (assetType === 'wayang') {
      if (
        !formData.wayangId ||
        !selectedWayang
      ) {
        setError(
          'Silakan pilih wayang.',
        )

        return false
      }
    }

    if (assetType === 'kotak') {
      if (
        !formData.penyimpananId ||
        !selectedKotak
      ) {
        setError(
          'Silakan pilih kotak.',
        )

        return false
      }
    }

 

    if (!formData.tanggalPinjam) {
      setError(
        'Tanggal pinjam wajib diisi.',
      )

      return false
    }

    if (!formData.tanggalKembali) {
      setError(
        'Tanggal kembali wajib diisi.',
      )

      return false
    }

    const tanggalPinjam =
      new Date(
        `${formData.tanggalPinjam}T00:00:00`,
      )

    const tanggalKembali =
      new Date(
        `${formData.tanggalKembali}T00:00:00`,
      )

    if (
      Number.isNaN(
        tanggalPinjam.getTime(),
      ) ||
      Number.isNaN(
        tanggalKembali.getTime(),
      )
    ) {
      setError(
        'Format tanggal tidak valid.',
      )

      return false
    }

    if (
      tanggalKembali <
      tanggalPinjam
    ) {
      setError(
        'Tanggal kembali tidak boleh sebelum tanggal pinjam.',
      )

      return false
    }

    return true
  }



  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError('')

    if (!validateForm()) {
      return
    }

    try {
      setLoadingSubmit(true)

      const payload: {
        namaPeminjam: string
        alamat: string
        noHp: string
        wayangId?: number
        penyimpananId?: number
        tanggalPinjam: string
        tanggalKembali: string
        keterangan?: string
      } = {
        namaPeminjam:
          formData.namaPeminjam.trim(),

        alamat:
          formData.alamat.trim(),

        noHp:
          formData.noHp.trim(),

        tanggalPinjam:
          formData.tanggalPinjam,

        tanggalKembali:
          formData.tanggalKembali,
      }

      /*
       * Tambahkan aset sesuai pilihan.
       */

      if (assetType === 'wayang') {
        payload.wayangId =
          Number(formData.wayangId)
      }

      if (assetType === 'kotak') {
        payload.penyimpananId =
          Number(formData.penyimpananId)
      }

    
      const keterangan =
        formData.keterangan.trim()

      if (keterangan) {
        payload.keterangan =
          keterangan
      }

      console.log(
        '================================',
      )

      console.log(
        'ASSET TYPE:',
        assetType,
      )

      console.log(
        'PAYLOAD PEMINJAMAN:',
        payload,
      )

      console.log(
        '================================',
      )

      await api.post(
        '/peminjaman',
        payload,
      )

     
      navigate(
        '/admin/peminjaman',
      )
    } catch (err: unknown) {
      console.error(
        'Create peminjaman error:',
        err,
      )

      setError(
        getErrorMessage(
          err,
          'Gagal menambahkan data peminjaman.',
        ),
      )
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="w-full px-6 py-8 lg:px-8">

      {/* HEADER */}

      <div className="w-full mb-8">

        <Link
          to="/admin/peminjaman"
          className="inline-flex items-center gap-2 mb-5 text-sm font-medium text-slate-500 hover:text-blue-600 no-underline transition-colors"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line
              x1="19"
              y1="12"
              x2="5"
              y2="12"
            />

            <polyline points="12 19 5 12 12 5" />
          </svg>

          Kembali ke Peminjaman
        </Link>

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">

            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

              <path d="m3.3 7 8.7 5 8.7-5" />

              <path d="M12 22V12" />
            </svg>

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Tambah Peminjaman
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Tambahkan data peminjaman wayang atau kotak ke dalam sistem.
            </p>

          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="w-full mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">

            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-red-600"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
              />

              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              />
            </svg>

          </div>

          <div>

            <p className="text-sm font-bold text-red-800">
              Terjadi kesalahan
            </p>

            <p className="text-sm text-red-700 mt-0.5">
              {error}
            </p>

          </div>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden"
      >


        <div className="px-8 py-6 border-b border-slate-100">

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />

                <circle
                  cx="12"
                  cy="7"
                  r="4"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-base font-bold text-slate-800">
                Informasi Peminjam
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Masukkan informasi lengkap mengenai peminjam.
              </p>

            </div>

          </div>

        </div>

        <div className="px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* NAMA */}

            <div className="lg:col-span-2">

              <label
                htmlFor="namaPeminjam"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Nama Peminjam

                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                id="namaPeminjam"
                name="namaPeminjam"
                type="text"
                value={
                  formData.namaPeminjam
                }
                onChange={
                  handleChange
                }
                placeholder="Masukkan nama lengkap peminjam"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* NO HP */}

            <div>

              <label
                htmlFor="noHp"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Nomor HP

                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                id="noHp"
                name="noHp"
                type="tel"
                value={
                  formData.noHp
                }
                onChange={
                  handleChange
                }
                placeholder="081234567890"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* ALAMAT */}

            <div>

              <label
                htmlFor="alamat"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Alamat

                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                id="alamat"
                name="alamat"
                type="text"
                value={
                  formData.alamat
                }
                onChange={
                  handleChange
                }
                placeholder="Masukkan alamat peminjam"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

        </div>

      

        <div className="px-8 py-6 border-t border-b border-slate-100">

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                />

                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                />

                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                />

                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-base font-bold text-slate-800">
                Detail Peminjaman
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Tentukan aset dan periode peminjaman.
              </p>

            </div>

          </div>

        </div>

        <div className="px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            <div className="lg:col-span-2">

              <label className="block text-sm font-bold text-slate-700 mb-3">
                Pilih Aset

                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* WAYANG */}

                <button
                  type="button"
                  onClick={() =>
                    handleAssetTypeChange(
                      'wayang',
                    )
                  }
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    assetType === 'wayang'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      assetType === 'wayang'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >

                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle
                        cx="12"
                        cy="7"
                        r="3"
                      />

                      <path d="M6 21c0-4 2.5-7 6-7s6 3 6 7" />

                      <path d="M9 10l-3 2" />

                      <path d="M15 10l3 2" />
                    </svg>

                  </div>

                  <div>

                    <p className="text-sm font-bold">
                      Wayang
                    </p>

                    <p className="text-xs opacity-70 mt-0.5">
                      Pilih satu wayang
                    </p>

                  </div>

                </button>

                {/* KOTAK */}

                <button
                  type="button"
                  onClick={() =>
                    handleAssetTypeChange(
                      'kotak',
                    )
                  }
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    assetType === 'kotak'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      assetType === 'kotak'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >

                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

                      <path d="m3.3 7 8.7 5 8.7-5" />

                      <path d="M12 22V12" />
                    </svg>

                  </div>

                  <div>

                    <p className="text-sm font-bold">
                      Kotak
                    </p>

                    <p className="text-xs opacity-70 mt-0.5">
                      Pilih satu kotak
                    </p>

                  </div>

                </button>

              </div>

            </div>


            {assetType === 'wayang' && (
              <div className="lg:col-span-2">

                <label
                  htmlFor="searchWayang"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Cari Wayang
                </label>

                <div className="flex gap-2">

                  <div className="relative flex-1">

                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                      id="searchWayang"
                      type="text"
                      value={
                        searchWayang
                      }
                      onChange={(e) =>
                        setSearchWayang(
                          e.target.value,
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter'
                        ) {
                          e.preventDefault()
                          searchWayangData()
                        }
                      }}
                      placeholder="Cari berdasarkan nama atau nomor wayang..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={
                      searchWayangData
                    }
                    disabled={
                      loadingSearch
                    }
                    className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold border-none cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loadingSearch
                      ? 'Mencari...'
                      : 'Cari'}
                  </button>

                </div>

                {/* SELECTED WAYANG */}

                {selectedWayang && (
                  <div className="mt-4 p-4 rounded-xl border-2 border-green-200 bg-green-50">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-medium text-green-600 mb-1">
                          Wayang dipilih
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                          {selectedWayang.noWayang
                            ? `${selectedWayang.noWayang} — ${selectedWayang.nama}`
                            : selectedWayang.nama}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedWayang(null)

                          setFormData(
                            (prev) => ({
                              ...prev,
                              wayangId: '',
                            }),
                          )
                        }}
                        className="text-xs font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                      >
                        Ganti
                      </button>

                    </div>

                  </div>
                )}

                {/* HASIL */}

                {hasSearchedWayang &&
                  !loadingSearch && (
                    <div className="mt-4">

                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Hasil pencarian
                      </p>

                      {wayangList.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">

                          {wayangList.map(
                            (wayang) => (
                              <button
                                key={
                                  wayang.id
                                }
                                type="button"
                                onClick={() =>
                                  handleSelectWayang(
                                    wayang,
                                  )
                                }
                                className={`w-full flex items-center justify-between px-4 py-3 text-left border-b last:border-b-0 border-slate-100 bg-white hover:bg-blue-50 cursor-pointer ${
                                  selectedWayang?.id ===
                                  wayang.id
                                    ? 'bg-blue-50'
                                    : ''
                                }`}
                              >

                                <div>

                                  <p className="text-sm font-semibold text-slate-800">
                                    {
                                      wayang.nama
                                    }
                                  </p>

                                  {wayang.noWayang && (
                                    <p className="text-xs text-slate-400 mt-0.5">
                                      {
                                        wayang.noWayang
                                      }
                                    </p>
                                  )}

                                </div>

                                <span className="text-xs font-semibold text-blue-600">
                                  Pilih
                                </span>

                              </button>
                            ),
                          )}

                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center">

                          <p className="text-sm text-slate-400">
                            Wayang tidak ditemukan.
                          </p>

                        </div>
                      )}

                    </div>
                  )}

              </div>
            )}


            {assetType === 'kotak' && (
              <div className="lg:col-span-2">

                <label
                  htmlFor="searchKotak"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Cari Kotak
                </label>

                <div className="flex gap-2">

                  <div className="relative flex-1">

                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                      id="searchKotak"
                      type="text"
                      value={
                        searchKotak
                      }
                      onChange={(e) =>
                        setSearchKotak(
                          e.target.value,
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter'
                        ) {
                          e.preventDefault()
                          searchKotakData()
                        }
                      }}
                      placeholder="Cari nama kotak..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={
                      searchKotakData
                    }
                    disabled={
                      loadingSearch
                    }
                    className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-bold border-none cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loadingSearch
                      ? 'Mencari...'
                      : 'Cari'}
                  </button>

                </div>

                {/* SELECTED KOTAK */}

                {selectedKotak && (
                  <div className="mt-4 p-4 rounded-xl border-2 border-green-200 bg-green-50">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-medium text-green-600 mb-1">
                          Kotak dipilih
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                          {
                            selectedKotak.namaKotak
                          }
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedKotak(null)

                          setFormData(
                            (prev) => ({
                              ...prev,
                              penyimpananId: '',
                            }),
                          )
                        }}
                        className="text-xs font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                      >
                        Ganti
                      </button>

                    </div>

                  </div>
                )}

                {/* HASIL KOTAK */}

                {hasSearchedKotak &&
                  !loadingSearch && (
                    <div className="mt-4">

                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Hasil pencarian
                      </p>

                      {kotakList.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">

                          {kotakList.map(
                            (kotak) => (
                              <button
                                key={
                                  kotak.id
                                }
                                type="button"
                                onClick={() =>
                                  handleSelectKotak(
                                    kotak,
                                  )
                                }
                                className={`w-full flex items-center justify-between px-4 py-3 text-left border-b last:border-b-0 border-slate-100 bg-white hover:bg-indigo-50 cursor-pointer ${
                                  selectedKotak?.id ===
                                  kotak.id
                                    ? 'bg-indigo-50'
                                    : ''
                                }`}
                              >

                                <div className="flex items-center gap-3">

                                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">

                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

                                      <path d="m3.3 7 8.7 5 8.7-5" />

                                      <path d="M12 22V12" />
                                    </svg>

                                  </div>

                                  <div>

                                    <p className="text-sm font-semibold text-slate-800">
                                      {
                                        kotak.namaKotak
                                      }
                                    </p>

                                    <p className="text-xs text-slate-400">
                                      ID Kotak:{' '}
                                      {
                                        kotak.id
                                      }
                                    </p>

                                  </div>

                                </div>

                                <span className="text-xs font-semibold text-indigo-600">
                                  Pilih
                                </span>

                              </button>
                            ),
                          )}

                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center">

                          <p className="text-sm text-slate-400">
                            Kotak tidak ditemukan.
                          </p>

                        </div>
                      )}

                    </div>
                  )}

              </div>
            )}

            <div>

              <label
                htmlFor="tanggalPinjam"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Tanggal Pinjam

                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                id="tanggalPinjam"
                name="tanggalPinjam"
                type="date"
                value={
                  formData.tanggalPinjam
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            <div>

              <label
                htmlFor="tanggalKembali"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Tanggal Kembali

                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                id="tanggalKembali"
                name="tanggalKembali"
                type="date"
                value={
                  formData.tanggalKembali
                }
                onChange={
                  handleChange
                }
                min={
                  formData.tanggalPinjam ||
                  undefined
                }
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>


            <div className="lg:col-span-2">

              <label
                htmlFor="keterangan"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Keterangan

                <span className="ml-2 text-xs font-normal text-slate-400">
                  Opsional
                </span>
              </label>

              <textarea
                id="keterangan"
                name="keterangan"
                rows={5}
                value={
                  formData.keterangan
                }
                onChange={
                  handleChange
                }
                placeholder="Tambahkan keterangan atau catatan peminjaman..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              <p className="text-xs text-slate-400 mt-2">
                Contoh: Digunakan untuk acara pagelaran wayang.
              </p>

            </div>

          </div>

        </div>


        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="text-xs text-slate-400">

            <span className="text-red-500 font-bold">
              *
            </span>{' '}

            Field wajib diisi

          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">

            <Link
              to="/admin/peminjaman"
              className="flex-1 sm:flex-none text-center px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 no-underline transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={
                loadingSubmit
              }
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold border-none cursor-pointer disabled:cursor-not-allowed shadow-sm transition-all"
            >

              {loadingSubmit ? (
                <>
                  <svg
                    className="animate-spin"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeOpacity="0.3"
                    />

                    <path d="M21 12a9 9 0 0 1-9 9" />
                  </svg>

                  Menyimpan...
                </>
              ) : (
                <>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  Simpan Peminjaman
                </>
              )}

            </button>

          </div>

        </div>

      </form>

      <div className="flex items-center justify-center gap-2 mt-5 pb-4 text-xs text-slate-400">

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
          <circle
            cx="12"
            cy="12"
            r="10"
          />

          <line
            x1="12"
            y1="16"
            x2="12"
            y2="12"
          />

          <line
            x1="12"
            y1="8"
            x2="12.01"
            y2="8"
          />
        </svg>

        Pastikan seluruh data peminjaman sudah benar sebelum disimpan.

      </div>

    </div>
  )
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isAxiosErrorLike(error)) {
    return fallback
  }

  const backendMessage =
    error.response?.data?.message

  if (
    Array.isArray(
      backendMessage,
    )
  ) {
    return backendMessage.join(
      ', ',
    )
  }

  if (
    typeof backendMessage ===
    'string'
  ) {
    return backendMessage
  }

  const backendError =
    error.response?.data?.error

  if (
    typeof backendError ===
    'string'
  ) {
    return backendError
  }

  if (
    typeof error.message ===
    'string'
  ) {
    return error.message
  }

  return fallback
}