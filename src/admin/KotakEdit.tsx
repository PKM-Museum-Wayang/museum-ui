import { useEffect, useState } from "react"
import api from '../lib/api'

interface PenyimpananFormModalProps {
    id: number
    onClose: () => void
    onSuccess: () => void
}

interface Penyimpanan {
    id: number
    namaKotak: string
}

export default function KotakEdit({id, onClose, onSuccess}: PenyimpananFormModalProps) {
    const [namaKotak, setNamaKotak] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [loadError, setLoadError] = useState('')
    const [loading, setLoading] = useState(true)

    const validate = () => {
      if (!namaKotak.trim()) {
        setFieldError('Nama wajib diisi.')
        return false
      }
      setFieldError('')
      return true
    }

    const handleSubmit = async (e: {preventDefault(): void }) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await api.patch(`/penyimpanan/${id}`, { namaKotak })
      onSuccess()
      onClose()
    } catch {
      setError('Gagal menyimpan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

    useEffect(() => {
        api.get(`penyimpanan/${id}`).then(res => {
            const p: Penyimpanan = res.data.data
            setNamaKotak(p.namaKotak)
        })
        .catch(() => setLoadError('Gagal memuat data.'))
        .finally(() => setLoading(false))
    }, [id])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center text-slate-400 text-sm">
          Memuat data…
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Edit Penyimpanan</h2>
          {(error || loadError) && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error || loadError}
            </div>
          )}
          <form onSubmit={handleSubmit}
          className="space-y-4"
          >
            <div>
              <label className="block text-slate text-slate-700 font-medium text-sm mb-1.5">Nama Kotak</label>
              <input type="text"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              value={namaKotak}
              onChange={e => setNamaKotak(e.target.value)}
              placeholder="isi nama kotak disini."
              />
              {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
            </div>

              <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg cursor-pointer border-none transition-colors">
                            Batal
                        </button>
                        <button type="submit" disabled={submitting}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg cursor-pointer border-none transition-colors">
                            {submitting ? 'Menyimpan…' : 'Simpan'}
                        </button>
                    </div>
          </form>
      </div>
    </div>
  )
}