import axios from 'axios'
import api, { BASE_URL } from './api'

export const HARI = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'] as const
export type Hari = typeof HARI[number]

export interface BiografiFields {
  namaPemilikKoleksi: string
  email: string
  phoneNumber: string
  alamat: string
  hariMulai: Hari
  hariSelesai: Hari
  jamBuka: string
  jamTutup: string
  instagram: string
  facebook: string
  youtube: string
}

export interface Biografi extends Omit<BiografiFields, 'instagram' | 'facebook' | 'youtube'> {
  id: number
  fotoProfil: string
  instagram: string | null
  facebook: string | null
  youtube: string | null
  createdAt: string
  updatedAt: string
}

interface Result<T> { data: T }

function multipart(fields: Partial<BiografiFields>, photo?: File) {
  const body = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) body.append(key, value)
  })
  if (photo) body.append('fotoProfil', photo)
  return body
}

export const biografiApi = {
  get: async (signal?: AbortSignal) => (await api.get<Result<Biografi>>('/biografi', { signal })).data.data,
  create: async (fields: BiografiFields, photo: File) =>
    (await api.post<Result<Biografi>>('/biografi', multipart(fields, photo))).data.data,
  update: async (fields: Partial<BiografiFields>, photo?: File) =>
    (await api.patch<Result<Biografi>>('/biografi', photo ? multipart(fields, photo) : fields)).data.data,
  remove: async () => { await api.delete('/biografi') },
}

export function photoUrl(path: string) {
  return new URL(path, BASE_URL).href
}

export function biografiError(error: unknown) {
  const fields: Record<string, string> = {}
  let message = 'Tidak dapat menghubungi server. Silakan coba lagi.'
  let status: number | undefined
  if (axios.isAxiosError(error)) {
    status = error.response?.status
    const body = error.response?.data
    if (typeof body?.message === 'string') message = body.message
    else if (Array.isArray(body?.message)) message = body.message.join(', ')
    if (Array.isArray(body?.errors)) {
      for (const item of body.errors) {
        if (typeof item.message !== 'string') continue
        if (item.field) fields[item.field] = item.message
        else message += ` ${item.message}`
      }
    }
    if (status === 401) message = 'Sesi Anda berakhir. Silakan login kembali.'
    if (status === 413) message = 'Foto terlalu besar. Maksimal 5 MiB.'
    if (status && status >= 500) message = 'Terjadi kesalahan server. Silakan coba lagi.'
  }
  return { message, fields, status }
}
