import { useState } from "react"
import api from '../lib/api'

const TIPE_GOLONGAN_LIST = [
    { value: 'SIMPINGAN_KIRI', label: 'Simpingan Kiri' },
    { value: 'SIMPINGAN_KANAN', label: 'Simpingan Kanan' },
    { value: 'DUDHAHAN', label: 'Dudhahan' },
]

interface GolonganFormModalProps {
    onclose: () => void
    onSuccess: () => void
}

export default function GolonganFormModal({ onclose, onSuccess}: GolonganFormModalProps) {
    const [namaGolongan, setNamaGolongan] = useState('')
    const [tipeGolongan, setTipeGolongan] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await api.post('/golongan', { namaGolongan, tipeGolongan })
            onSuccess()
            onclose()
        } catch {

        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onclose}>
            <div className="bg-white rounded-xl shadown-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>

                <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Golongan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Golongan</label>
                        <input
                            type="text"
                            value={namaGolongan}
                            onChange={e => setNamaGolongan(e.target.value)}
                            placeholder="cth. Ringgit Raton"
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe Golongan</label>
                        <select
                            value={tipeGolongan}
                            onChange={e => setTipeGolongan(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition bg-white"
                        >
                            <option value="">Pilih Tipe Golongan</option>
                            {TIPE_GOLONGAN_LIST.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={onclose}
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
