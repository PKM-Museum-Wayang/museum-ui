import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Koleksi from './pages/Koleksi'
import KoleksiDetail from './pages/KoleksiDetail'
import Kegiatan from './pages/Kegiatan'
import About from './pages/About'
import Kontak from './pages/Kontak'
import Login from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import WayangCreate from './admin/WayangCreate'
import WayangEdit from './admin/WayangEdit'
import GolonganManage from './admin/GolonganManage'
import PenyimpananManage from './admin/kotakManage'
import WayangCerita from './admin/AdminCerita'
import KegiatanManage from './admin/KegiatanManage'

import AuthOnly from './guards/AuthOnly'
import AdminPeminjaman from './admin/PeminjamanManage'
import AdminPeminjamanCreate from './admin/PeminjamanCreate'
import AdminPeminjamanEdit from './admin/PeminjamanEdit'

import KegiatanDetail from './pages/KegiatanDetail'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/koleksi" element={<Koleksi />} />
          <Route path="/koleksi/:id" element={<KoleksiDetail />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/kegiatan/:id" element={<KegiatanDetail />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        {/* ── Admin login (tanpa sidebar) ── */}
        <Route path="/admin/login" element={<Login />} />

        {/* ── Admin dashboard ── */}
        <Route path="/admin" element={<AdminLayout />}>
         <Route element={<AuthOnly/>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="wayang/create" element={<WayangCreate />} />
              <Route path="wayang/:id/edit" element={<WayangEdit />} />
              <Route path="cerita" element={<WayangCerita />} />
              <Route path="penyimpanan" element={<PenyimpananManage />} />
              <Route path="golongan" element={<GolonganManage />} />
              <Route path="peminjaman" element={<AdminPeminjaman />} />
              <Route path="peminjaman/create" element={<AdminPeminjamanCreate />} />
              <Route path="peminjaman/:id/edit" element={<AdminPeminjamanEdit />} />
              <Route path="kegiatan" element={< KegiatanManage/> } />
         </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
