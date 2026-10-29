import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const TOPIK = [
  { value: 'KUNJUNGAN', label: 'Kunjungan' },
  { value: 'PENELITIAN', label: 'Penelitian' },
  { value: 'KERJA_SAMA', label: 'Kerja Sama' },
  { value: 'DONASI_KOLEKSI', label: 'Donasi Koleksi' },
  { value: 'LAINNYA', label: 'Lainnya' },
] as const

type Topik = typeof TOPIK[number]['value']
interface Pesan {
  id: number
  namaLengkap: string
  asal: string
  email: string
  noTelp: string
  jenisTopik: Topik
  pesan: string
  createdAt: string
  updatedAt: string
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }
interface ListResponse { data: Pesan[]; pagination: Pagination }

const labelTopik = (value: Topik) => TOPIK.find(item => item.value === value)?.label ?? value
const tanggal = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

function messageError(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    sessionStorage.removeItem('isLogin')
    return { message: 'Sesi Anda berakhir. Silakan login kembali.', expired: true }
  }
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return { message: 'Pesan tidak ditemukan. Pesan mungkin sudah dihapus.', expired: false }
  }
  return { message: 'Tidak dapat memuat pesan. Periksa koneksi dan coba lagi.', expired: false }
}

export default function PesanKontakManage() {
  const [items, setItems] = useState<Pesan[]>([])
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<Topik | ''>('')
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [retry, setRetry] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<Pesan | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [detailRetry, setDetailRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    api.get<ListResponse>('/pesan-kontak', {
      params: { page, limit: 10, ...(filter ? { jenisTopik: filter } : {}) },
      signal: controller.signal,
    }).then(response => {
      if (!controller.signal.aborted) {
        setItems(response.data.data)
        setPagination(response.data.pagination)
        setError('')
        setExpired(false)
      }
    }).catch(err => {
      if (!controller.signal.aborted) {
        const failure = messageError(err)
        setError(failure.message)
        setExpired(failure.expired)
      }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [page, filter, retry])

  useEffect(() => {
    if (selectedId === null) return
    const controller = new AbortController()
    api.get<{ data: Pesan }>(`/pesan-kontak/${selectedId}`, { signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setDetail(response.data.data) })
      .catch(err => {
        if (!controller.signal.aborted) {
          const failure = messageError(err)
          setDetailError(failure.message)
          setExpired(failure.expired)
        }
      }).finally(() => { if (!controller.signal.aborted) setDetailLoading(false) })
    return () => controller.abort()
  }, [selectedId, detailRetry])

  useEffect(() => {
    if (selectedId === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedId])

  function openDetail(id: number) {
    setDetail(null)
    setDetailError('')
    setDetailLoading(true)
    setSelectedId(id)
  }

  return <div className="mx-auto max-w-6xl text-sm">
    <div className="mb-6">
      <h1 className="text-xl font-bold text-slate-900">Pesan Kontak</h1>
      <p className="mt-1 text-xs text-slate-400">Lihat pesan yang dikirim pengunjung melalui formulir kontak.</p>
    </div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      {error} {expired ? <Link to="/admin/login" className="font-semibold underline">Login kembali</Link> : <button type="button" onClick={() => { setLoading(true); setRetry(value => value + 1) }} className="ml-2 font-semibold underline">Coba lagi</button>}
    </div>}
    <div className="mb-5 max-w-xs">
      <label htmlFor="filter-topik" className="mb-2 block text-xs font-semibold text-slate-600">Filter topik</label>
      <select id="filter-topik" value={filter} onChange={event => {
        setLoading(true)
        setPage(1)
        setFilter(event.target.value as Topik | '')
      }} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
        <option value="">Semua topik</option>
        {TOPIK.map(topic => <option key={topic.value} value={topic.value}>{topic.label}</option>)}
      </select>
    </div>
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {loading ? <div role="status" className="py-16 text-center text-slate-400">Memuat pesan…</div> : error ? <div className="py-12 text-center text-slate-400">Daftar pesan belum dapat ditampilkan.</div> : items.length === 0 ? <div className="py-16 text-center text-slate-400">{filter ? 'Tidak ada pesan untuk topik ini.' : 'Belum ada pesan kontak.'}</div> : <>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead><tr>{['Tanggal', 'Pengirim', 'Topik', 'Pesan', 'Aksi'].map(header => <th key={header} className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{header}</th>)}</tr></thead>
            <tbody>{items.map(item => <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="whitespace-nowrap px-5 py-4 text-slate-500">{tanggal(item.createdAt)}</td>
              <td className="px-5 py-4"><p className="font-medium text-slate-800">{item.namaLengkap}</p><p className="mt-1 text-xs text-slate-400">{item.asal}</p></td>
              <td className="whitespace-nowrap px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">{labelTopik(item.jenisTopik)}</span></td>
              <td className="max-w-xs px-5 py-4 text-slate-500"><p className="truncate">{item.pesan}</p></td>
              <td className="px-5 py-4"><button type="button" onClick={() => openDetail(item.id)} className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600">Lihat detail</button></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Menampilkan {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} pesan</span>
          <div className="flex items-center gap-3">
            <button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage(value => value - 1) }} className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 disabled:opacity-40">Sebelumnya</button>
            <span>Halaman {pagination.page} dari {Math.max(pagination.totalPages, 1)}</span>
            <button type="button" disabled={page >= pagination.totalPages} onClick={() => { setLoading(true); setPage(value => value + 1) }} className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 disabled:opacity-40">Berikutnya</button>
          </div>
        </div>
      </>}
    </div>
    {selectedId !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={() => setSelectedId(null)}>
      <div role="dialog" aria-modal="true" aria-labelledby="detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div><h2 id="detail-title" className="text-lg font-bold text-slate-900">Detail Pesan</h2><p className="mt-1 text-xs text-slate-400">Informasi pesan dari pengunjung.</p></div>
          <button type="button" onClick={() => setSelectedId(null)} aria-label="Tutup detail pesan" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6">
          {detailLoading ? <p role="status" className="py-10 text-center text-slate-400">Memuat detail pesan…</p> : detailError ? <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{detailError} {expired ? <Link to="/admin/login" className="font-semibold underline">Login kembali</Link> : <button type="button" onClick={() => { setDetailLoading(true); setDetailError(''); setDetailRetry(value => value + 1) }} className="font-semibold underline">Coba lagi</button>}</div> : detail && <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">{labelTopik(detail.jenisTopik)}</span><span className="text-xs text-slate-400">{tanggal(detail.createdAt)}</span></div>
            <dl className="grid gap-5 sm:grid-cols-2">{[
              { label: 'Nama lengkap', value: detail.namaLengkap },
              { label: 'Asal', value: detail.asal },
              { label: 'Email', value: detail.email },
              { label: 'Nomor telepon', value: detail.noTelp },
            ].map(field => <div key={field.label}><dt className="text-xs font-semibold text-slate-400">{field.label}</dt><dd className="mt-1 break-words text-slate-800">{field.value}</dd></div>)}</dl>
            <div className="mt-6 border-t border-slate-100 pt-5"><h3 className="text-xs font-semibold text-slate-400">Pesan</h3><p className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 leading-relaxed text-slate-700">{detail.pesan}</p></div>
          </>}
        </div>
      </div>
    </div>}
  </div>
}
