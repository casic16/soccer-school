import { useAuthStore, getDisplayName } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const RoleDashboard =
    dashboardByRole[profile?.role] || AdminDashboard

  const displayName = getDisplayName(
    profile,
    i18n.language
  )

  const firstName =
    displayName?.split(' ')?.[0] || displayName

  const locale =
    i18n.language === 'en'
      ? 'en-CA'
      : i18n.language === 'ar'
      ? 'ar'
      : 'fr-CA'

  const currentDate =
    new Date().toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="space-y-7">
      {/* Intro */}
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-[13px]
              text-slate-400
              capitalize
              mb-1
            "
          >
            {currentDate}
          </p>

          <h2
            className="
              text-[28px]
              leading-tight
              font-heading
              font-bold
              tracking-tight
            "
            style={{
              color: 'hsl(222, 47%, 11%)',
            }}
          >
            Bonjour {firstName} 👋
          </h2>

          <p className="text-sm text-slate-500 mt-1.5">
            Voici ce qui se passe dans votre club aujourd'hui.
          </p>
        </div>

        {(profile?.role === 'admin' ||
          profile?.role === 'coach') && (
          <button
            onClick={() => navigate('/events')}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md
            "
            style={{
              background: 'hsl(142, 71%, 45%)',
              color: 'hsl(222, 47%, 11%)',
            }}
          >
            <span className="text-lg leading-none">
              +
            </span>

            Nouvel événement
          </button>
        )}
      </div>

      <RoleDashboard />
    </div>
  )
}