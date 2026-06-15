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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.hello')} {getDisplayName(profile, i18n.language)} 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <RoleDashboard />
    </div>
  )
}