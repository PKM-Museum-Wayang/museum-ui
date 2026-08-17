import { useState } from "react"
import api from '../lib/api' 

interface PenyimpananFormModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function KotakCreate({ onClose, onSuccess}: PenyimpananFormModalProps) {
  const [namaKotak, setNamaKotak] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: {preventDefault(): void }) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/penyimpanan')
      onSuccess()
      onClose()
    } catch {

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadown-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Penyimpanan</h2>
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
              required
              />
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
