import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

const DAERAH_ASAL_LIST = [
  'Yogyakarta',
  'Surakarta',
  'Kedu',
]

const KONDISI_LIST = [
  'Baik',
  'Cukup Baik',
  'Perlu Restorasi',
  'Rusak',
]

const GAYA_LIST = [
  'Purwo Yogyakarta',
  'Purwo Surakarta',
  'Purwo Kedu',
]

const TIPE_GOLONGAN_LIST = [
  {
    value: 'SIMPINGAN_KIRI',
    label: 'Simpingan Kiri',
  },
  {
    value: 'SIMPINGAN_KANAN',
    label: 'Simpingan Kanan',
  },
  {
    value: 'DUDHAHAN',
    label: 'Dudhahan',
  },
]

interface Golongan {
  id: number
  namaGolongan: string
  tipeGolongan: string
}

interface Penyimpanan {
  id: number
  namaKotak: string
}

interface WayangSearchResult {
  id: number
  nama: string
  noWayang: string
}

interface WayangFormData {
  nama: string
  daerah: string
  deskripsi: string
  cerita: string
  kondisi: string
  gaya: string
  tipeGolongan: string
  golonganId: string
  penyimpananId: string
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

const isAxiosErrorLike = (
  error: unknown,
): error is AxiosErrorLike => {
  if (
    typeof error !== 'object' ||
    error === null
  ) {
    return false
  }

  return (
    'response' in error ||
    'message' in error
  )
}

export default function WayangCreate() {
  const navigate = useNavigate()

  const fileRef =
    useRef<HTMLInputElement>(null)

  const [formData, setFormData] =
    useState<WayangFormData>({
      nama: '',
      daerah: '',
      deskripsi: '',
      cerita: '',
      kondisi: '',
      gaya: '',
      tipeGolongan: '',
      golonganId: '',
      penyimpananId: '',
    })

  const [golonganList, setGolonganList] =
    useState<Golongan[]>([])

  const [penyimpananList, setPenyimpananList] =
    useState<Penyimpanan[]>([])

  const [fileName, setFileName] =
    useState<string>('')

  const [loadingData, setLoadingData] =
    useState(true)

  const [loadingSubmit, setLoadingSubmit] =
    useState(false)

  const [error, setError] =
    useState<string>('')

  const [relasiQuery, setRelasiQuery] =
    useState<string>('')

  const [relasiResult, setRelasiResult] =
    useState<WayangSearchResult[]>([])

  const [relasiSelected, setRelasiSelected] =
    useState<WayangSearchResult[]>([])

  const [relasiSearching, setRelasiSearching] =
    useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        setError('')

        const [
          golonganResponse,
          penyimpananResponse,
        ] = await Promise.all([

          api.get('/golongan/all'),

          api.get('/penyimpanan'),
        ])

        const golonganData =
          golonganResponse.data?.data

        const penyimpananResponseData =
          penyimpananResponse.data?.data

        if (Array.isArray(golonganData)) {
          setGolonganList(golonganData)
        } else {
          setGolonganList([])
        }


        if (
          Array.isArray(
            penyimpananResponseData,
          )
        ) {
          setPenyimpananList(
            penyimpananResponseData,
          )
        } else {
          setPenyimpananList([])
        }
      } catch (err: unknown) {
        console.error(
          'Fetch data wayang create error:',
          err,
        )

        setError(
          getErrorMessage(
            err,
            'Gagal memuat data golongan dan penyimpanan.',
          ),
        )
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])


  const handleChange = (
    e: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
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

  const handleTipeGolonganChange = (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value

    setFormData((prev) => ({
      ...prev,
      tipeGolongan: value,
      golonganId: '',
    }))

    if (error) {
      setError('')
    }
  }


  const filteredGolongan =
    golonganList.filter(
      (golongan) =>
        golongan.tipeGolongan ===
        formData.tipeGolongan,
    )

  const handleRelasiSearch = async () => {
    const query =
      relasiQuery.trim()

    if (!query) {
      setRelasiResult([])
      return
    }

    try {
      setRelasiSearching(true)

      const response =
        await api.get('/wayang', {
          params: {
            search: query,
            limit: 8,
          },
        })

      const list =
        response.data?.data?.data

      if (!Array.isArray(list)) {
        setRelasiResult([])
        return
      }

      const filteredList =
        list.filter(
          (
            wayang: WayangSearchResult,
          ) =>
            !relasiSelected.some(
              (selected) =>
                selected.id ===
                wayang.id,
            ),
        )

      setRelasiResult(
        filteredList,
      )
    } catch (err: unknown) {
      console.error(
        'Search relasi wayang error:',
        err,
      )

      setRelasiResult([])
    } finally {
      setRelasiSearching(false)
    }
  }


  const handleRelasiKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      void handleRelasiSearch()
    }
  }

  const addRelasi = (
    wayang: WayangSearchResult,
  ) => {
    setRelasiSelected(
      (prev) => [
        ...prev,
        wayang,
      ],
    )

    setRelasiResult(
      (prev) =>
        prev.filter(
          (item) =>
            item.id !==
            wayang.id,
        ),
    )
  }


  const removeRelasi = (
    id: number,
  ) => {
    setRelasiSelected(
      (prev) =>
        prev.filter(
          (item) =>
            item.id !== id,
        ),
    )
  }



  const validateForm = (): boolean => {
    if (!formData.nama.trim()) {
      setError(
        'Nama wayang wajib diisi.',
      )
      return false
    }

    if (!formData.daerah) {
      setError(
        'Daerah asal wajib dipilih.',
      )
      return false
    }

    if (!formData.gaya) {
      setError(
        'Gaya wajib dipilih.',
      )
      return false
    }

    if (!formData.tipeGolongan) {
      setError(
        'Tipe golongan wajib dipilih.',
      )
      return false
    }

    if (!formData.golonganId) {
      setError(
        'Nama golongan wajib dipilih.',
      )
      return false
    }

    if (!formData.penyimpananId) {
      setError(
        'Kotak penyimpanan wajib dipilih.',
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


      const payload = {
        nama:
          formData.nama.trim(),

        gaya:
          formData.gaya,

        daerah:
          formData.daerah,

        deskripsi:
          formData.deskripsi.trim()
            ? formData.deskripsi.trim()
            : undefined,

        cerita:
          formData.cerita.trim()
            ? formData.cerita.trim()
            : undefined,

        kondisi:
          formData.kondisi || undefined,

        golonganId:
          Number(
            formData.golonganId,
          ),

        penyimpananId:
          Number(
            formData.penyimpananId,
          ),
      }

      console.log(
        'Payload wayang:',
        payload,
      )


      const response =
        await api.post(
          '/wayang',
          payload,
        )

      const wayangId =
        response.data?.data?.id

      if (!wayangId) {
        throw new Error(
          'ID wayang tidak ditemukan dari response server.',
        )
      }

      const selectedFile =
        fileRef.current?.files?.[0]

      if (selectedFile) {
        const body =
          new FormData()

        body.append(
          'file',
          selectedFile,
        )

        body.append(
          'namaFile',
          formData.nama.trim(),
        )

        body.append(
          'jenis',
          'IMAGE',
        )

        await api.post(
          `/wayang/${wayangId}/media`,
          body,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          },
        )
      }

      navigate(
        '/admin/dashboard',
      )
    } catch (err: unknown) {
      console.error(
        'Create wayang error:',
        err,
      )

      setError(
        getErrorMessage(
          err,
          'Gagal menambahkan data wayang.',
        ),
      )
    } finally {
      setLoadingSubmit(false)
    }
  }


  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      <div className="w-full mb-7 lg:mb-8">

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 mb-5 text-xs sm:text-sm font-medium text-slate-500 hover:text-blue-600 no-underline transition-colors"
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

          Kembali ke Dashboard
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">

          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600 sm:w-[27px] sm:h-[27px]"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>

          </div>

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Tambah Wayang Baru
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tambahkan data wayang baru ke dalam sistem.
            </p>

          </div>

        </div>
      </div>


      {error && (
        <div className="w-full mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 sm:px-5 py-4">

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

            <p className="text-xs sm:text-sm text-red-700 mt-0.5">
              {error}
            </p>

          </div>

        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden"
      >

        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">

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

              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Informasi Wayang
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Masukkan informasi dasar mengenai wayang.
              </p>

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

            {/* NAMA */}

            <div className="lg:col-span-2">

              <label
                htmlFor="nama"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Nama
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                id="nama"
                name="nama"
                type="text"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama tokoh wayang"
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* DAERAH */}

            <div>

              <label
                htmlFor="daerah"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Daerah Asal
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <select
                id="daerah"
                name="daerah"
                value={formData.daerah}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Pilih daerah asal
                </option>

                {DAERAH_ASAL_LIST.map(
                  (daerah) => (
                    <option
                      key={daerah}
                      value={daerah}
                    >
                      {daerah}
                    </option>
                  ),
                )}
              </select>

            </div>

            {/* GAYA */}

            <div>

              <label
                htmlFor="gaya"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Gaya
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <select
                id="gaya"
                name="gaya"
                value={formData.gaya}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Pilih gaya
                </option>

                {GAYA_LIST.map(
                  (gaya) => (
                    <option
                      key={gaya}
                      value={gaya}
                    >
                      {gaya}
                    </option>
                  ),
                )}
              </select>

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-5 sm:py-6 border-t border-b border-slate-100">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">

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
                <path d="M4 4h16v16H4z" />
                <path d="M8 8h8" />
                <path d="M8 12h8" />
                <path d="M8 16h5" />
              </svg>

            </div>

            <div>

              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Klasifikasi Wayang
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Tentukan golongan dan lokasi penyimpanan wayang.
              </p>

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* TIPE GOLONGAN */}

            <div>

              <label
                htmlFor="tipeGolongan"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Tipe Golongan
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <select
                id="tipeGolongan"
                name="tipeGolongan"
                value={formData.tipeGolongan}
                onChange={
                  handleTipeGolonganChange
                }
                disabled={loadingData}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingData
                    ? 'Memuat golongan...'
                    : 'Pilih tipe golongan'}
                </option>

                {TIPE_GOLONGAN_LIST.map(
                  (tipe) => (
                    <option
                      key={tipe.value}
                      value={tipe.value}
                    >
                      {tipe.label}
                    </option>
                  ),
                )}
              </select>

            </div>

            {/* NAMA GOLONGAN */}

            <div>

              <label
                htmlFor="golonganId"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Nama Golongan
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <select
                id="golonganId"
                name="golonganId"
                value={formData.golonganId}
                onChange={handleChange}
                disabled={
                  !formData.tipeGolongan ||
                  loadingData
                }
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingData
                    ? 'Memuat golongan...'
                    : formData.tipeGolongan
                      ? filteredGolongan.length ===
                        0
                        ? 'Tidak ada golongan'
                        : 'Pilih nama golongan'
                      : 'Pilih tipe golongan dulu'}
                </option>

                {filteredGolongan.map(
                  (golongan) => (
                    <option
                      key={golongan.id}
                      value={golongan.id}
                    >
                      {
                        golongan.namaGolongan
                      }
                    </option>
                  ),
                )}
              </select>

              {formData.tipeGolongan &&
                !loadingData &&
                filteredGolongan.length ===
                  0 && (
                  <p className="text-[11px] sm:text-xs text-amber-600 mt-2">
                    Belum ada golongan untuk tipe
                    ini.
                  </p>
                )}

            </div>

            {/* PENYIMPANAN */}

            <div>

              <label
                htmlFor="penyimpananId"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Kotak Penyimpanan
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <select
                id="penyimpananId"
                name="penyimpananId"
                value={
                  formData.penyimpananId
                }
                onChange={handleChange}
                disabled={loadingData}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingData
                    ? 'Memuat penyimpanan...'
                    : penyimpananList.length ===
                        0
                      ? 'Tidak ada kotak tersedia'
                      : 'Pilih kotak penyimpanan'}
                </option>

                {penyimpananList.map(
                  (penyimpanan) => (
                    <option
                      key={penyimpanan.id}
                      value={penyimpanan.id}
                    >
                      {
                        penyimpanan.namaKotak
                      }
                    </option>
                  ),
                )}
              </select>

              {!loadingData &&
                penyimpananList.length >
                  0 && (
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                    {
                      penyimpananList.length
                    }{' '}
                    kotak penyimpanan tersedia.
                  </p>
                )}

            </div>

            {/* KONDISI */}

            <div>

              <label
                htmlFor="kondisi"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Kondisi

                <span className="ml-2 text-[10px] sm:text-xs font-normal text-slate-400">
                  Opsional
                </span>
              </label>

              <select
                id="kondisi"
                name="kondisi"
                value={formData.kondisi}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Pilih kondisi
                </option>

                {KONDISI_LIST.map(
                  (kondisi) => (
                    <option
                      key={kondisi}
                      value={kondisi}
                    >
                      {kondisi}
                    </option>
                  ),
                )}
              </select>

            </div>

          </div>

        </div>


        <div className="px-5 sm:px-8 py-5 sm:py-6 border-t border-b border-slate-100">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-600"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M8 8h8" />
                <path d="M8 12h6" />
                <path d="M8 16h8" />
              </svg>

            </div>

            <div>

              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Informasi Tambahan
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Tambahkan deskripsi dan cerita mengenai wayang.
              </p>

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          <div className="grid grid-cols-1 gap-5 sm:gap-6">

            {/* DESKRIPSI */}

            <div>

              <label
                htmlFor="deskripsi"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Deskripsi

                <span className="ml-2 text-[10px] sm:text-xs font-normal text-slate-400">
                  Opsional
                </span>
              </label>

              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                value={
                  formData.deskripsi
                }
                onChange={handleChange}
                placeholder="Masukkan deskripsi singkat tentang wayang..."
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* CERITA */}

            <div>

              <label
                htmlFor="cerita"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                Cerita

                <span className="ml-2 text-[10px] sm:text-xs font-normal text-slate-400">
                  Opsional
                </span>
              </label>

              <textarea
                id="cerita"
                name="cerita"
                rows={6}
                value={
                  formData.cerita
                }
                onChange={handleChange}
                placeholder="Masukkan cerita atau latar belakang tokoh wayang..."
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-5 sm:py-6 border-t border-b border-slate-100">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <circle
                  cx="18"
                  cy="5"
                  r="3"
                />

                <circle
                  cx="6"
                  cy="12"
                  r="3"
                />

                <circle
                  cx="18"
                  cy="19"
                  r="3"
                />

                <line
                  x1="8.6"
                  y1="13.5"
                  x2="15.4"
                  y2="17.5"
                />

                <line
                  x1="15.4"
                  y1="6.5"
                  x2="8.6"
                  y2="10.5"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Relasi Wayang
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Hubungkan wayang ini dengan tokoh wayang lainnya.
              </p>

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          {/* SELECTED RELATION */}

          {relasiSelected.length >
            0 && (
            <div className="mb-4">

              <p className="text-xs sm:text-sm font-bold text-slate-700 mb-2">
                Wayang yang dipilih
              </p>

              <div className="flex flex-wrap gap-2">

                {relasiSelected.map(
                  (relasi) => (
                    <span
                      key={relasi.id}
                      className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] sm:text-xs font-semibold rounded-full"
                    >

                      <span>
                        {
                          relasi.nama
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeRelasi(
                            relasi.id,
                          )
                        }
                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 cursor-pointer border-none bg-transparent text-blue-700 transition-colors"
                        aria-label={`Hapus relasi ${relasi.nama}`}
                      >
                        ×
                      </button>

                    </span>
                  ),
                )}

              </div>

            </div>
          )}

          {/* SEARCH */}

          <label
            htmlFor="relasiSearch"
            className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
          >
            Cari Wayang
          </label>

          <div className="relative">

            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>

            </div>

            <input
              id="relasiSearch"
              type="search"
              value={
                relasiQuery
              }
              onChange={(e) =>
                setRelasiQuery(
                  e.target.value,
                )
              }
              onKeyDown={
                handleRelasiKeyDown
              }
              placeholder="Cari nama wayang yang berelasi..."
              className="w-full pl-11 pr-28 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

            <button
              type="button"
              onClick={() =>
                void handleRelasiSearch()
              }
              disabled={
                relasiSearching
              }
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[11px] sm:text-xs font-bold rounded-lg cursor-pointer disabled:cursor-not-allowed border-none transition-colors"
            >
              {relasiSearching
                ? 'Mencari...'
                : 'Cari'}
            </button>

          </div>

          {/* SEARCH RESULT */}

          {relasiResult.length >
            0 && (
            <div className="mt-3 border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">

              {relasiResult.map(
                (wayang) => (
                  <button
                    type="button"
                    key={wayang.id}
                    onClick={() =>
                      addRelasi(
                        wayang,
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left bg-white hover:bg-slate-50 cursor-pointer border-none transition-colors"
                  >

                    <div className="min-w-0">

                      <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                        {
                          wayang.nama
                        }
                      </p>

                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                        {
                          wayang.noWayang
                        }
                      </p>

                    </div>

                    <div className="flex-shrink-0">

                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600">

                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
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

                      </span>

                    </div>

                  </button>
                ),
              )}

            </div>
          )}

          {relasiQuery.trim() &&
            !relasiSearching &&
            relasiResult.length ===
              0 && (
              <p className="text-xs text-slate-400 mt-3">
                Tidak ada wayang yang ditemukan.
              </p>
            )}

        </div>


        <div className="px-5 sm:px-8 py-5 sm:py-6 border-t border-b border-slate-100">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                />

                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                />

                <path d="m21 15-5-5L5 21" />
              </svg>

            </div>

            <div>

              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Gambar Wayang
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Upload gambar untuk dokumentasi wayang.
              </p>

            </div>

          </div>

        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            <label className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-colors">

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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line
                  x1="12"
                  y1="3"
                  x2="12"
                  y2="15"
                />
              </svg>

              Pilih Gambar

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setFileName(
                    e.target.files?.[0]
                      ?.name ?? '',
                  )

                  if (error) {
                    setError('')
                  }
                }}
              />

            </label>

            {fileName && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 min-w-0">

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-500 flex-shrink-0"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>

                <span className="truncate">
                  {fileName}
                </span>

              </div>
            )}

          </div>

          <p className="text-[11px] sm:text-xs text-slate-400 mt-3">
            Format gambar yang didukung mengikuti konfigurasi server.
          </p>

        </div>


        <div className="px-5 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="text-[11px] sm:text-xs text-slate-400">

            <span className="text-red-500 font-bold">
              *
            </span>{' '}

            Field wajib diisi

          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">

            <Link
              to="/admin/dashboard"
              className="flex-1 sm:flex-none text-center px-5 sm:px-6 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 no-underline transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={
                loadingSubmit ||
                loadingData
              }
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs sm:text-sm font-bold border-none cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
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

                  Simpan Wayang
                </>
              )}

            </button>

          </div>

        </div>

      </form>

      <div className="flex items-center justify-center gap-2 mt-5 pb-4 text-[11px] sm:text-xs text-slate-400 text-center">

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
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

        Pastikan seluruh data wayang sudah benar sebelum disimpan.

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