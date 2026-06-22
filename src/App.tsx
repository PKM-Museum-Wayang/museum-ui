import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Koleksi from './pages/Koleksi'
import KoleksiDetail from './pages/KoleksiDetail'
import Kegiatan from './pages/Kegiatan'
import About from './pages/About'
import Kontak from './pages/Kontak'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import KoleksiCreate from './admin/KoleksiCreate'
import KoleksiEdit from './admin/KoleksiEdit'

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
          <Route path="/tentang" element={<About />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="koleksi/create" element={<KoleksiCreate />} />
          <Route path="koleksi/:id/edit" element={<KoleksiEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
