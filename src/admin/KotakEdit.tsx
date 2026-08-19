import { useEffect, useState, type ChangeEvent } from "react"
import api from '../lib/api' 
import { useParams } from "react-router-dom"

interface PenyimpananFormModalProps {
    onClose: () => void
    onSuccess: () => void 
}

interface Penyimpanan {
    id: number
    namaKotak: string
}

interface FormState {
    namaKotak: string
}

export default function KotakEdit({onClose, onSuccess}: PenyimpananFormModalProps) {
    const { id } = useParams()
    const [form, setForm] = useState<FormState>({
        namaKotak: ''
    })
    const [namaKotak, setNamaKotak] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [submitError, setSubmitError] = useState('')
    const [Loading, setLoading] = useState(true)

    const handleSubmit = async (e: {preventDefault(): void }) => {
    e.preventDefault()
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
            setForm({
                namaKotak: String(p.namaKotak)
            })
        })
        .catch(() => setSubmitError('Gagall memuat data.'))
        .finally(() => setLoading(false))
    }, [id])

      const set = (field: keyof FormState) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
          setForm(prev => ({ ...prev, [field]: e.target.value }))

        const validate = () => {
    const err: Partial<Record<keyof FormState, string>> = {}
    if (!form.namaKotak.trim()) err.namaKotak = 'Nama wajib diisi.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadown-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Penyimpanan</h2>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
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