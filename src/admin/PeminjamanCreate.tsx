import {
  useEffect,
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

interface FormData {
  namaPeminjam: string
  alamat: string
  noHp: string
  wayangId: string
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



const isAxiosErrorLike = (
  error: unknown
): error is AxiosErrorLike => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  return 'response' in error || 'message' in error
}

export default function AdminPeminjamanCreate() {
  const navigate = useNavigate()


  const [wayangList, setWayangList] = useState<Wayang[]>([])

  const [formData, setFormData] = useState<FormData>({
    namaPeminjam: '',
    alamat: '',
    noHp: '',
    wayangId: '',
    tanggalPinjam: '',
    tanggalKembali: '',
    keterangan: '',
  })

  const [loadingWayang, setLoadingWayang] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [error, setError] = useState<string>('')


  useEffect(() => {
    const fetchWayang = async () => {
      try {
        setLoadingWayang(true)
        setError('')

        const res = await api.get('/wayang')

        console.log('Response wayang:', res.data)

        const wayangData = res.data?.data?.data

        if (Array.isArray(wayangData)) {
          setWayangList(wayangData)
        } else {
          setWayangList([])

          setError(
            'Format data wayang dari server tidak sesuai.'
          )
        }
      } catch (err: unknown) {
        console.error('Fetch wayang error:', err)

        setWayangList([])

        setError(
          getErrorMessage(
            err,
            'Gagal memuat daftar wayang.'
          )
        )
      } finally {
        setLoadingWayang(false)
      }
    }

    fetchWayang()
  }, [])



  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
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



  const validateForm = (): boolean => {

    if (!formData.namaPeminjam.trim()) {
      setError('Nama peminjam wajib diisi.')
      return false
    }


    if (!formData.alamat.trim()) {
      setError('Alamat wajib diisi.')
      return false
    }


    if (!formData.noHp.trim()) {
      setError('Nomor HP wajib diisi.')
      return false
    }

 
    if (!formData.wayangId) {
      setError('Silakan pilih wayang.')
      return false
    }



    if (!formData.tanggalPinjam) {
      setError('Tanggal pinjam wajib diisi.')
      return false
    }


    if (!formData.tanggalKembali) {
      setError('Tanggal kembali wajib diisi.')
      return false
    }



    const tanggalPinjam = new Date(
      `${formData.tanggalPinjam}T00:00:00`
    )

    const tanggalKembali = new Date(
      `${formData.tanggalKembali}T00:00:00`
    )

    if (
      Number.isNaN(tanggalPinjam.getTime()) ||
      Number.isNaN(tanggalKembali.getTime())
    ) {
      setError('Format tanggal tidak valid.')
      return false
    }



    if (tanggalKembali < tanggalPinjam) {
      setError(
        'Tanggal kembali tidak boleh sebelum tanggal pinjam.'
      )

      return false
    }

    return true
  }


  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError('')


    if (!validateForm()) {
      return
    }

    try {
      setLoadingSubmit(true)



      const payload = {
        namaPeminjam:
          formData.namaPeminjam.trim(),

        alamat:
          formData.alamat.trim(),

        noHp:
          formData.noHp.trim(),

        wayangId:
          Number(formData.wayangId),

        tanggalPinjam:
          formData.tanggalPinjam,

        tanggalKembali:
          formData.tanggalKembali,

        keterangan:
          formData.keterangan.trim()
            ? formData.keterangan.trim()
            : undefined,
      }

      console.log(
        'Payload peminjaman:',
        payload
      )

      await api.post(
        '/peminjaman',
        payload
      )


      navigate('/admin/peminjaman')
    } catch (err: unknown) {
      console.error(
        'Create peminjaman error:',
        err
      )

      setError(
        getErrorMessage(
          err,
          'Gagal menambahkan data peminjaman.'
        )
      )
    } finally {
      setLoadingSubmit(false)
    }
  }


  return (
    <div className="w-full px-6 py-8 lg:px-8">

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

          {/* ICON */}

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
              {/* Box / Peminjaman */}

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
              Tambahkan data peminjaman wayang baru ke dalam sistem.
            </p>

          </div>

        </div>

      </div>


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
                value={formData.namaPeminjam}
                onChange={handleChange}
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

              <div className="relative">

                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

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
                    <rect
                      x="5"
                      y="2"
                      width="14"
                      height="20"
                      rx="2"
                    />

                    <line
                      x1="12"
                      y1="18"
                      x2="12.01"
                      y2="18"
                    />
                  </svg>

                </div>

                <input
                  id="noHp"
                  name="noHp"
                  type="tel"
                  value={formData.noHp}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            </div>

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
                value={formData.alamat}
                onChange={handleChange}
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
                Tentukan wayang dan periode peminjaman.
              </p>

            </div>

          </div>

        </div>

        <div className="px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">

              <label
                htmlFor="wayangId"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Wayang

                <span className="text-red-500 ml-1">
                  *
                </span>

              </label>

              <select
                id="wayangId"
                name="wayangId"
                value={formData.wayangId}
                onChange={handleChange}
                disabled={loadingWayang}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >

                <option value="">
                  {loadingWayang
                    ? 'Memuat daftar wayang...'
                    : wayangList.length === 0
                      ? 'Tidak ada wayang tersedia'
                      : 'Pilih wayang yang akan dipinjam'}
                </option>

                {wayangList.map((wayang) => (
                  <option
                    key={wayang.id}
                    value={wayang.id}
                  >
                    {wayang.noWayang
                      ? `${wayang.noWayang} — ${wayang.nama}`
                      : wayang.nama}
                  </option>
                ))}

              </select>

              {!loadingWayang &&
                wayangList.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">

                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
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

                    {wayangList.length} wayang tersedia.

                  </div>
                )}

            </div>

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
                value={formData.tanggalPinjam}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
                value={formData.tanggalKembali}
                onChange={handleChange}
                min={
                  formData.tanggalPinjam ||
                  undefined
                }
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Tambahkan keterangan atau catatan peminjaman..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
                loadingSubmit ||
                loadingWayang
              }
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold border-none cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
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
  fallback: string
): string {


  if (!isAxiosErrorLike(error)) {
    return fallback
  }


  const backendMessage =
    error.response?.data?.message


  if (Array.isArray(backendMessage)) {
    return backendMessage.join(', ')
  }



  if (typeof backendMessage === 'string') {
    return backendMessage
  }


  const backendError =
    error.response?.data?.error

  if (typeof backendError === 'string') {
    return backendError
  }

  if (typeof error.message === 'string') {
    return error.message
  }

  return fallback
}