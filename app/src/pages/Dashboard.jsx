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
        <h2 className="text-2xl font-bold text-gray-800">
          {t('dashboard.hello')} {getDisplayName(profile, i18n.language)} 👋
        </h2>
        <p className="text-gray-500">
          {t('dashboard.role')} :{' '}
          <span className="font-medium capitalize">
            {profile?.role ? t(`roles.${profile.role}`) : ''}
          </span>
        </p>
      </div>
      <RoleDashboard />
    </div>
  )
}