import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Events from './pages/Events'
import AppLayout from './components/layout/AppLayout'
import Availability from './pages/Availability'
import Players from './pages/Players'
import TeamDetail from './pages/TeamDetail'
import Users from './pages/Users'
import Notifications from './pages/Notifications'
import Stats from './pages/Stats'
import Invitations from './pages/Invitations'
import Register from './pages/Register'
import RegisterSchool from './pages/public/RegisterSchool'
import SuperAdmin from './pages/SuperAdmin'

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
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="availability" element={<Availability />} />
          <Route path="players" element={<Players />} />
          <Route path="users" element={<Users />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="stats" element={<Stats />} />
          <Route path="invitations" element={<Invitations />} />
          <Route path="/register-school" element={<RegisterSchool />} />
          <Route path="super-admin" element={<SuperAdmin />} />
        
        </Route>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/register-school" element={<RegisterSchool />} />
        </Routes>
    </BrowserRouter>
  )
}