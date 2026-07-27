import { useAuthStore, getDisplayName } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import CoachDashboard from '../components/dashboard/CoachDashboard'
import ParentDashboard from '../components/dashboard/ParentDashboard'
import PlayerDashboard from '../components/dashboard/PlayerDashboard'

const dashboardByRole = {
  admin: AdminDashboard,
  coach: CoachDashboard,
  parent: ParentDashboard,
  player: PlayerDashboard,
}

export default function Dashboard() {
  const { profile } = useAuthStore()
  const { t, i18n } = useTranslation()
  const RoleDashboard = dashboardByRole[profile?.role] || AdminDashboard

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h2 className="text-xl font-heading font-bold mt-0.5" style={{ color: 'hsl(222, 47%, 11%)' }}>
          Bonjour {getDisplayName(profile, i18n.language)} 👋
        </h2>
      </div>
      <RoleDashboard />
    </div>
  )
}