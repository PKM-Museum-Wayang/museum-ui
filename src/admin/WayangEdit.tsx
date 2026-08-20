import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { BASE_URL } from '../lib/api'

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

interface MediaWayang {
  id: number
  namaFile: string
  jenis: 'IMAGE' | 'VIDEO'
  fileUrl: string
}

interface WayangDetail {
  id: number
  noWayang: string
  nama: string
  daerah?: string
  deskripsi?: string
  cerita?: string
  kondisi?: string
  gaya?: string
  golonganId: number
  golongan: {
    id: number
    namaGolongan: string
    tipeGolongan: string
  }
  penyimpananId: number
  media: MediaWayang[]
}

interface FormState {
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
  if (typeof error !== 'object' || error === null) {
    return false
  }

  return 'response' in error || 'message' in error
}

export default function WayangEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [noWayang, setNoWayang] = useState('')

  const [formData, setFormData] = useState<FormState>({
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

  const [golonganList, setGolonganList] = useState<Golongan[]>([])
  const [penyimpananList, setPenyimpananList] = useState<
    Penyimpanan[]
  >([])

  const [existingMedia, setExistingMedia] = useState<
    MediaWayang[]
  >([])

  const [fileName, setFileName] = useState('')

  const [loadingData, setLoadingData] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [error, setError] = useState('')

  // =========================================================
  // FETCH DATA
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        setError('')

        const [
          golonganResponse,
          penyimpananResponse,
          wayangResponse,
        ] = await Promise.all([
          api.get('/golongan'),
          api.get('/penyimpanan'),
          api.get(`/wayang/${id}`),
        ])

        const golonganData =
          golonganResponse.data?.data

        const penyimpananData =
          penyimpananResponse.data?.data

        const wayangData: WayangDetail =
          wayangResponse.data?.data

        if (Array.isArray(golonganData)) {
          setGolonganList(golonganData)
        } else {
          setGolonganList([])
        }

        if (Array.isArray(penyimpananData)) {
          setPenyimpananList(penyimpananData)
        } else {
          setPenyimpananList([])
        }

        if (!wayangData) {
          throw new Error(
            'Data wayang tidak ditemukan.',
          )
        }

        setNoWayang(wayangData.noWayang)

        setFormData({
          nama: wayangData.nama ?? '',
          daerah: wayangData.daerah ?? '',
          deskripsi: wayangData.deskripsi ?? '',
          cerita: wayangData.cerita ?? '',
          kondisi: wayangData.kondisi ?? '',
          gaya: wayangData.gaya ?? '',
          tipeGolongan:
            wayangData.golongan?.tipeGolongan ?? '',
          golonganId:
            wayangData.golonganId != null
              ? String(wayangData.golonganId)
              : '',
          penyimpananId:
            wayangData.penyimpananId != null
              ? String(wayangData.penyimpananId)
              : '',
        })

        setExistingMedia(
          Array.isArray(wayangData.media)
            ? wayangData.media
            : [],
        )
      } catch (err: unknown) {
        console.error(
          'Fetch wayang edit error:',
          err,
        )

        setError(
          getErrorMessage(
            err,
            'Gagal memuat data wayang.',
          ),
        )
      } finally {
        setLoadingData(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // =========================================================
  // HANDLE FORM
  // =========================================================

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  // =========================================================
  // HANDLE TIPE GOLONGAN
  // =========================================================

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

  // =========================================================
  // FILTER GOLONGAN
  // =========================================================

  const filteredGolongan =
    golonganList.filter(
      (golongan) =>
        golongan.tipeGolongan ===
        formData.tipeGolongan,
    )

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = (): boolean => {
    if (!formData.nama.trim()) {
      setError('Nama wayang wajib diisi.')
      return false
    }

    if (!formData.daerah) {
      setError('Daerah asal wajib dipilih.')
      return false
    }

    if (!formData.gaya) {
      setError('Gaya wajib dipilih.')
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

  // =========================================================
  // DELETE MEDIA
  // =========================================================

  const handleDeleteMedia = async (
    mediaId: number,
  ) => {
    try {
      setError('')

      await api.delete(
        `/wayang/media/${mediaId}`,
      )

      setExistingMedia((prev) =>
        prev.filter(
          (media) => media.id !== mediaId,
        ),
      )
    } catch (err: unknown) {
      console.error(
        'Delete media error:',
        err,
      )

      setError(
        getErrorMessage(
          err,
          'Gagal menghapus gambar.',
        ),
      )
    }
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError('')

    if (!validateForm()) {
      return
    }

    if (!id) {
      setError('ID wayang tidak ditemukan.')
      return
    }

    try {
      setLoadingSubmit(true)

      // 1. Update data wayang
      const payload = {
        nama: formData.nama.trim(),

        gaya: formData.gaya,

        daerah: formData.daerah,

        deskripsi: formData.deskripsi.trim()
          ? formData.deskripsi.trim()
          : undefined,

        cerita: formData.cerita.trim()
          ? formData.cerita.trim()
          : undefined,

        kondisi: formData.kondisi || undefined,

        golonganId: Number(
          formData.golonganId,
        ),

        penyimpananId: Number(
          formData.penyimpananId,
        ),
      }

      console.log(
        'Update payload:',
        payload,
      )

      await api.patch(
        `/wayang/${id}`,
        payload,
      )

      // 2. Upload gambar baru jika ada
      const selectedFile =
        fileRef.current?.files?.[0]

      if (selectedFile) {
        const body = new FormData()

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
          `/wayang/${id}/media`,
          body,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          },
        )
      }

      // 3. Kembali ke dashboard
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      console.error(
        'Update wayang error:',
        err,
      )

      setError(
        getErrorMessage(
          err,
          'Gagal menyimpan perubahan wayang.',
        ),
      )
    } finally {
      setLoadingSubmit(false)
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingData) {
    return (
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col items-center justify-center py-24">
            <svg
              className="animate-spin text-blue-600 mb-4"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                strokeOpacity="0.25"
              />
              <path d="M21 12a9 9 0 0 1-9 9" />
            </svg>

            <p className="text-sm font-medium text-slate-500">
              Memuat data wayang...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const imageMedia =
    existingMedia.filter(
      (media) => media.jenis === 'IMAGE',
    )

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

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
              Edit Wayang
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Perbarui informasi wayang yang sudah tersimpan.
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

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

      {/* =====================================================
          FORM CARD
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden"
      >

        {/* ===================================================
            SECTION 1 — INFORMASI DASAR
        ==================================================== */}

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
                Perbarui informasi dasar mengenai wayang.
              </p>
            </div>

          </div>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

            {/* NO WAYANG */}

            <div>
              <label
                htmlFor="noWayang"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
              >
                No. Wayang
              </label>

              <input
                id="noWayang"
                type="text"
                value={noWayang}
                disabled
                readOnly
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-400 outline-none cursor-not-allowed"
              />

              <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                Nomor wayang dibuat otomatis dan tidak dapat diubah.
              </p>
            </div>

            {/* NAMA */}

            <div>
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

        {/* ===================================================
            SECTION 2 — KLASIFIKASI
        ==================================================== */}

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
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Pilih tipe golongan
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
                  {formData.tipeGolongan
                    ? 'Pilih nama golongan'
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
                value={formData.penyimpananId}
                onChange={handleChange}
                disabled={loadingData}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {penyimpananList.length === 0
                    ? 'Tidak ada kotak tersedia'
                    : 'Pilih kotak penyimpanan'}
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

              {penyimpananList.length >
                0 && (
                <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                  {penyimpananList.length}{' '}
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

        {/* ===================================================
            SECTION 3 — DESKRIPSI & CERITA
        ==================================================== */}

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
                Perbarui deskripsi dan cerita mengenai wayang.
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
                value={formData.deskripsi}
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
                value={formData.cerita}
                onChange={handleChange}
                placeholder="Masukkan cerita atau latar belakang tokoh wayang..."
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

          </div>
        </div>

        {/* ===================================================
            SECTION 4 — GAMBAR
        ==================================================== */}

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
                Kelola gambar dokumentasi wayang.
              </p>
            </div>

          </div>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">

          {/* EXISTING IMAGE */}

          <div className="mb-5">

            <p className="text-xs sm:text-sm font-bold text-slate-700 mb-3">
              Gambar Saat Ini
            </p>

            {imageMedia.length > 0 ? (
              <div className="flex flex-wrap gap-4">

                {imageMedia.map(
                  (media) => (
                    <div
                      key={media.id}
                      className="relative group"
                    >

                      <img
                        src={`${BASE_URL}${media.fileUrl}`}
                        alt={media.namaFile}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-slate-100 border border-slate-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteMedia(
                            media.id,
                          )
                        }
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm flex items-center justify-center border-2 border-white cursor-pointer shadow-sm transition-colors"
                        aria-label={`Hapus gambar ${media.namaFile}`}
                      >
                        ×
                      </button>

                    </div>
                  ),
                )}

              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-slate-300 mb-2"
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

                <p className="text-xs text-slate-400">
                  Belum ada gambar.
                </p>
              </div>
            )}

          </div>

          {/* ADD IMAGE */}

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

              Tambah Gambar

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setFileName(
                    e.target.files?.[0]
                      ?.name ?? '',
                  )
                }
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
            Jika memilih gambar baru, gambar tersebut akan ditambahkan ke media wayang.
          </p>

        </div>

        {/* ===================================================
            FOOTER FORM
        ==================================================== */}

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

                  Simpan Perubahan
                </>
              )}
            </button>

          </div>

        </div>

      </form>

      {/* =====================================================
          FOOTER INFO
      ====================================================== */}

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

        Pastikan seluruh perubahan data wayang sudah benar sebelum disimpan.

      </div>

    </div>
  )
}

// =========================================================
// ERROR MESSAGE
// =========================================================

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isAxiosErrorLike(error)) {
    return fallback
  }

  const backendMessage =
    error.response?.data?.message

  if (Array.isArray(backendMessage)) {
    return backendMessage.join(', ')
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