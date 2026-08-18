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

export default function AdminPeminjaman() {
  const [peminjamanList, setPeminjamanList] =
    useState<Peminjaman[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')



  const fetchPeminjaman = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await api.get('/peminjaman')

      console.log('Response peminjaman:', res.data)
      setPeminjamanList(res.data.data)
    } catch (err) {
      console.error(err)

      setError(
        'Gagal memuat data. Pastikan backend sudah berjalan di port 3000.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPeminjaman()
  }, [])


  const getStatus = (
    peminjaman: Peminjaman
  ): StatusPeminjaman => {
  
    if (
      peminjaman.status ===
      'DIKEMBALIKAN'
    ) {
      return 'DIKEMBALIKAN'
    }

    const today = new Date()

    const tanggalKembali =
      new Date(
        peminjaman.tanggalKembali
      )

    if (today > tanggalKembali) {
      return 'TERLAMBAT'
    }

    return 'DIPINJAM'
  }


  const formatTanggal = (
    tanggal: string
  ) => {
    return new Date(
      tanggal
    ).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }



  const getStatusStyle = (
    status: StatusPeminjaman
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


  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        'Yakin ingin menghapus data peminjaman ini?'
      )

    if (!confirmed) return

    try {
      await api.delete(
        `/peminjaman/${id}`
      )

      setPeminjamanList(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      )
    } catch (err) {
      console.error(err)

      setError(
        'Gagal menghapus data peminjaman.'
      )

      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }

  return (
    <>


      {error && (
        <div className="flex items-center gap-2 px-5 py-4 mb-6 rounded-lg text-[0.9rem] bg-red-50 text-red-800 border border-red-200">
          ✗ {error}
        </div>
      )}

  

      <div className="mb-8">
        <p className="text-slate-400 text-sm mb-1">
          Total: {peminjamanList.length}{' '}
          peminjaman
        </p>

        <h1 className="text-2xl font-bold text-slate-900">
          Kelola Peminjaman
        </h1>
      </div>

      <div className="flex items-center gap-3 mb-6">


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
            disabled
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none bg-white text-slate-400 cursor-not-allowed"
          />
        </div>

        {/* FILTER - STATIS */}

        <select
          disabled
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-400 bg-white outline-none cursor-not-allowed"
          defaultValue=""
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

        {/* TAMBAH */}

        <Link
          to="/admin/peminjaman/create"
          className="inline-flex items-center gap-2 px-5 py-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg no-underline transition-colors whitespace-nowrap"
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

        {/* LOADING */}

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Memuat data…
          </div>

        ) : peminjamanList.length > 0 ? (

          <table className="w-full border-collapse">

            {/* HEADER */}

            <thead>
              <tr>
                {[
                  'No',
                  'Nama Peminjam',
                  'Tanggal Pinjam',
                  'Tanggal Kembali',
                  'Status',
                  'Aksi',
                ].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="bg-slate-50 px-5 py-[0.85rem] text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* BODY */}

            <tbody>
              {peminjamanList.map(
                (
                  peminjaman,
                  idx
                ) => {
                  const status =
                    getStatus(
                      peminjaman
                    )

                  return (
                    <tr
                      key={
                        peminjaman.id
                      }
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* NO */}

                      <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">
                        {idx + 1}
                      </td>

                      {/* NAMA */}

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

                      {/* TANGGAL PINJAM */}

                      <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">
                        {formatTanggal(
                          peminjaman
                            .tanggalPinjam
                        )}
                      </td>

                      {/* TANGGAL KEMBALI */}

                      <td className="px-5 py-4 text-[0.9rem] text-slate-500 border-b border-slate-100">
                        {formatTanggal(
                          peminjaman
                            .tanggalKembali
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4 border-b border-slate-100">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* AKSI */}

                      <td className="px-5 py-4 border-b border-slate-100">
                        <div className="flex gap-2">

                          <Link
                            to={`/admin/peminjaman/${peminjaman.id}/edit`}
                            className="inline-flex items-center px-3 py-[0.4rem] bg-amber-500 hover:bg-amber-600 text-white text-[0.8rem] font-medium rounded-lg no-underline transition-colors"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                peminjaman.id
                              )
                            }
                            className="inline-flex items-center px-3 py-[0.4rem] bg-red-500 hover:bg-red-600 text-white text-[0.8rem] font-medium rounded-lg cursor-pointer border-none transition-colors"
                          >
                            Hapus
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                }
              )}
            </tbody>
          </table>

        ) : (

          <div className="py-12 text-center text-slate-400">
            Belum ada data peminjaman. Klik
            "Tambah Peminjam" untuk menambahkan.
          </div>

        )}

      </div>
    </>
  )
}