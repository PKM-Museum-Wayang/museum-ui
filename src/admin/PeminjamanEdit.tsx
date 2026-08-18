import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import axios from 'axios'
import api from '../lib/api'


interface Wayang {
  id: number
  nama: string
  noWayang?: string
}

interface Peminjaman {
  id: number

  peminjam: {
    id: number
    namaPeminjam: string
    alamat: string
    noHp: string
  }

  wayang: {
    id: number
    nama: string
  }

  tanggalPinjam: string
  tanggalKembali: string
  keterangan?: string | null
  status: 'DIPINJAM' | 'DIKEMBALIKAN'
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

interface BackendErrorResponse {
  success?: boolean
  statusCode?: number
  message?: string | string[]
  data?: unknown
}

const getErrorMessage = (
  error: unknown,
  defaultMessage: string
): string => {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const message =
      error.response?.data?.message

    if (Array.isArray(message)) {
      return message.join(', ')
    }

    if (typeof message === 'string') {
      return message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}



export default function AdminPeminjamanEdit() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()


  const [wayangList, setWayangList] =
    useState<Wayang[]>([])

  const [formData, setFormData] =
    useState<FormData>({
      namaPeminjam: '',
      alamat: '',
      noHp: '',
      wayangId: '',
      tanggalPinjam: '',
      tanggalKembali: '',
      keterangan: '',
    })

  const [loading, setLoading] =
    useState(true)

  const [loadingWayang, setLoadingWayang] =
    useState(true)

  const [loadingSubmit, setLoadingSubmit] =
    useState(false)

  const [error, setError] =
    useState<string>('')

 
  const formatDateInput = (
    tanggal: string
  ): string => {
    if (!tanggal) {
      return ''
    }

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(tanggal)
    ) {
      return tanggal
    }

    return tanggal.substring(0, 10)
  }


  useEffect(() => {
    const fetchWayang = async () => {
      try {
        setLoadingWayang(true)

        const res = await api.get('/wayang')

        console.log(
          'Response wayang:',
          res.data
        )

        const wayangData =
          res.data?.data?.data

        if (Array.isArray(wayangData)) {
          setWayangList(wayangData)
        } else {
          setWayangList([])

          setError(
            'Format data wayang dari server tidak sesuai.'
          )
        }
      } catch (error: unknown) {
        console.error(
          'Error fetch wayang:',
          error
        )

        setError(
          getErrorMessage(
            error,
            'Gagal memuat daftar wayang.'
          )
        )
      } finally {
        setLoadingWayang(false)
      }
    }

    fetchWayang()
  }, [])



  useEffect(() => {
    const fetchPeminjaman = async () => {
      if (!id) {
        setError(
          'ID peminjaman tidak ditemukan.'
        )

        setLoading(false)

        return
      }

      try {
        setLoading(true)
        setError('')

        const res = await api.get(
          `/peminjaman/${id}`
        )

        console.log(
          'Response peminjaman:',
          res.data
        )

        const data =
          res.data?.data as
            | Peminjaman
            | undefined

        if (!data) {
          setError(
            'Data peminjaman tidak ditemukan.'
          )

          return
        }

        setFormData({
          namaPeminjam:
            data.peminjam?.namaPeminjam ??
            '',

          alamat:
            data.peminjam?.alamat ??
            '',

          noHp:
            data.peminjam?.noHp ??
            '',

          wayangId:
            String(
              data.wayang?.id ?? ''
            ),

          tanggalPinjam:
            formatDateInput(
              data.tanggalPinjam
            ),

          tanggalKembali:
            formatDateInput(
              data.tanggalKembali
            ),

          keterangan:
            data.keterangan ?? '',
        })
      } catch (error: unknown) {
        console.error(
          'Error fetch peminjaman:',
          error
        )

        setError(
          getErrorMessage(
            error,
            'Gagal memuat data peminjaman.'
          )
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPeminjaman()
  }, [id])


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
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

    if (
      !formData.namaPeminjam.trim()
    ) {
      setError(
        'Nama peminjam wajib diisi.'
      )

      return false
    }


    if (
      !formData.alamat.trim()
    ) {
      setError(
        'Alamat wajib diisi.'
      )

      return false
    }


    if (
      !formData.noHp.trim()
    ) {
      setError(
        'Nomor HP wajib diisi.'
      )

      return false
    }


    if (!formData.wayangId) {
      setError(
        'Silakan pilih wayang.'
      )

      return false
    }

    

    if (
      !formData.tanggalPinjam
    ) {
      setError(
        'Tanggal pinjam wajib diisi.'
      )

      return false
    }

    if (
      !formData.tanggalKembali
    ) {
      setError(
        'Tanggal kembali wajib diisi.'
      )

      return false
    }



    const tanggalPinjam =
      new Date(
        `${formData.tanggalPinjam}T00:00:00`
      )

    const tanggalKembali =
      new Date(
        `${formData.tanggalKembali}T00:00:00`
      )

    if (
      Number.isNaN(
        tanggalPinjam.getTime()
      ) ||
      Number.isNaN(
        tanggalKembali.getTime()
      )
    ) {
      setError(
        'Format tanggal tidak valid.'
      )

      return false
    }


    if (
      tanggalKembali <=
      tanggalPinjam
    ) {
      setError(
        'Tanggal kembali harus setelah tanggal pinjam.'
      )

      return false
    }

    return true
  }


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError('')



    if (!validateForm()) {
      return
    }



    if (!id) {
      setError(
        'ID peminjaman tidak ditemukan.'
      )

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
        'Payload update peminjaman:',
        payload
      )

      await api.patch(
        `/peminjaman/${id}`,
        payload
      )

      navigate(
        '/admin/peminjaman'
      )
    } catch (error: unknown) {
      console.error(
        'Error update peminjaman:',
        error
      )

      setError(
        getErrorMessage(
          error,
          'Gagal memperbarui data peminjaman.'
        )
      )
    } finally {
      setLoadingSubmit(false)
    }
  }


  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">

            <svg
              className="animate-spin text-blue-600"
              width="24"
              height="24"
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

          </div>

          <p className="text-sm font-semibold text-slate-700">
            Memuat data peminjaman...
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Mohon tunggu sebentar
          </p>

        </div>
      </div>
    )
  }



  return (
    <div className="w-full px-6 py-8 lg:px-10 xl:px-14">


      <div className="w-full mb-8">

        <Link
          to="/admin/peminjaman"
          className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-slate-500 hover:text-blue-600 no-underline transition-colors"
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

        <div className="flex items-center gap-5">

          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">

            <svg
              width="29"
              height="29"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <path d="M12 20h9" />

              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>

          </div>

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                Edit Peminjaman
              </h1>

              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold">
                EDIT
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-2">
              Perbarui informasi peminjaman
              wayang yang sudah tersimpan.
            </p>

          </div>

        </div>

      </div>

 

      {error && (
        <div className="w-full mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">

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

            <p className="text-sm text-red-700 mt-1">
              {error}
            </p>

          </div>

        </div>
      )}

 

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(15,23,42,0.07)] overflow-hidden"
      >



        <div className="px-8 lg:px-10 py-7 border-b border-slate-100">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

              <svg
                width="21"
                height="21"
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

              <h2 className="text-lg font-bold text-slate-800">
                Informasi Peminjam
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Perbarui informasi orang yang
                melakukan peminjaman.
              </p>

            </div>

          </div>

        </div>

        <div className="px-8 lg:px-10 py-9">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

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

              <input
                id="noHp"
                name="noHp"
                type="tel"
                value={formData.noHp}
                onChange={handleChange}
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
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat peminjam"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

        </div>


        <div className="px-8 lg:px-10 py-7 border-t border-b border-slate-100">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">

              <svg
                width="21"
                height="21"
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

              <h2 className="text-lg font-bold text-slate-800">
                Detail Peminjaman
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Perbarui wayang dan periode
                peminjaman.
              </p>

            </div>

          </div>

        </div>

        <div className="px-8 lg:px-10 py-9">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

            {/* WAYANG */}

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
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-400"
              >

                <option value="">
                  {loadingWayang
                    ? 'Memuat daftar wayang...'
                    : wayangList.length === 0
                      ? 'Tidak ada wayang tersedia'
                      : 'Pilih wayang'}
                </option>

                {wayangList.map(
                  (wayang) => (
                    <option
                      key={wayang.id}
                      value={wayang.id}
                    >
                      {wayang.noWayang
                        ? `${wayang.noWayang} — ${wayang.nama}`
                        : wayang.nama}
                    </option>
                  )
                )}

              </select>

              {!loadingWayang &&
                wayangList.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">
                    {wayangList.length}{' '}
                    wayang tersedia.
                  </p>
                )}

            </div>

            {/* TANGGAL PINJAM */}

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
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* TANGGAL KEMBALI */}

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
                onChange={handleChange}
                min={
                  formData.tanggalPinjam ||
                  undefined
                }
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* KETERANGAN */}

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
                onChange={handleChange}
                placeholder="Tambahkan keterangan atau catatan..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

        </div>

    

        <div className="px-8 lg:px-10 py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="text-xs text-slate-400">

            <span className="text-red-500 font-bold">
              *
            </span>{' '}

            Field wajib diisi

          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">

            <Link
              to="/admin/peminjaman"
              className="flex-1 sm:flex-none text-center px-7 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100 no-underline transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={
                loadingSubmit ||
                loadingWayang
              }
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold border-none cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
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



      <div className="flex items-center justify-center gap-2 mt-5 pb-4 text-xs text-slate-400">

        <svg
          width="14"
          height="14"
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

        Pastikan perubahan data sudah benar
        sebelum disimpan.

      </div>

    </div>
  )
}