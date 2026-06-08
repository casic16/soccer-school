import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Events from './pages/Events'
import AppLayout from './components/layout/AppLayout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="teams" element={<Teams />} />
          <Route path="events" element={<Events />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}