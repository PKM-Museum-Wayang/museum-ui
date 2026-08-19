import { useEffect, useState, type ChangeEvent } from "react"
import api from '../lib/api'

const TIPE_GOLONGAN_LIST = [
    { value: 'SIMPINGAN_KIRI', label: 'Simpingan Kiri' },
    { value: 'SIMPINGAN_KANAN', label: 'Simpingan Kanan' },
    { value: 'DUDHAHAN', label: 'Dudhahan' },
]

interface GolonganFormModalProps {
    id: number
    onClose:  () => void
    onSuccess: () => void
}

interface Golongan {
    id: number
    namaGolongan: string
    tipeGolongan: string
}

interface FormState {
    namaGolongan: string
    tipeGolongan: string
}

export default function GolonganEdit({id, onClose, onSuccess}: GolonganFormModalProps) {
    const [form, setForm] = useState<FormState>({
        namaGolongan: '',
        tipeGolongan: '',
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [submitError, setSubmitError] = useState('')
    const [Loading, setLoading] = useState(true)

        const handleSubmit = async (e: {preventDefault(): void }) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await api.patch(`/golongan/${id}`, { namaGolongan: form.namaGolongan, tipeGolongan: form.tipeGolongan, })
      onSuccess()
      onClose()
    } catch {
      setError('Gagal menyimpan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

    useEffect(() => {
        api.get(`/golongan/${id}`).then(res => {
            const p: Golongan = res.data.data
            setForm({
                namaGolongan: p.namaGolongan,
                tipeGolongan: p.tipeGolongan,
            })
        })
        .catch(() => setSubmitError('Gagal memuat data.'))
        .finally(() => setLoading(false))
    }, [id])

    const set = (field: keyof FormState) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(prev => ({ ...prev, [field]: e.target.value }))

    const validate = () => {
        const err: Partial<Record<keyof FormState, string>> = {}
        if (!form.namaGolongan.trim()) err.namaGolongan = 'Nama wajib diisi.'
        if (!form.tipeGolongan) err.tipeGolongan = 'Tipe golongan wajib dipilih.'
        setErrors(err)
        return Object.keys(err).length === 0
    }
    
    if (Loading) {
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
                <h2 className="text-lg font-bold text-slate-900 mb-4">Edit Golongan</h2>

                {(error || submitError) && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                        {error || submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Golongan</label>
                        <input
                            type="text"
                            value={form.namaGolongan}
                            onChange={set('namaGolongan')}
                            placeholder="cth. Ringgit Raton"
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        />
                        {errors.namaGolongan && <p className="text-red-500 text-xs mt-1">{errors.namaGolongan}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe Golongan</label>
                        <select
                            value={form.tipeGolongan}
                            onChange={set('tipeGolongan')}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition bg-white"
                        >
                            <option value="">Pilih Tipe Golongan</option>
                            {TIPE_GOLONGAN_LIST.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        {errors.tipeGolongan && <p className="text-red-500 text-xs mt-1">{errors.tipeGolongan}</p>}
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
