import { Navigate, Route, Routes } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import TrackOrderPage from './pages/TrackOrderPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/pedido" element={<TrackOrderPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
