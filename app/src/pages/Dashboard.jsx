import { useAuthStore, getDisplayName } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'
import { useEvents } from '../hooks/useEvents'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../components/ui/Badge'

const typeColor = { match: 'blue', training: 'green', other: 'gray' }
const typeLabel = { match: 'Match', training: 'Entraînement', other: 'Autre' }

export default function Dashboard() {
  const { profile } = useAuthStore()
  const { t, i18n } = useTranslation()
  const { teams } = useTeams()
  const { events } = useEvents()
  const { availabilities } = useAvailabilities()
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {t('dashboard.hello')} {getDisplayName(profile, i18n.language)} 👋
      </h2>
      <p className="text-gray-500 mb-8">
        {t('dashboard.role')} :{' '}
        <span className="font-medium capitalize">
          {profile?.role ? t(`roles.${profile.role}`) : ''}
        </span>
      </p>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          onClick={() => navigate('/teams')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 transition"
        >
          <p className="text-sm text-gray-500">{t('dashboard.teams')}</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{teams.length}</p>
        </div>
        <div
          onClick={() => navigate('/events')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 transition"
        >
          <p className="text-sm text-gray-500">{t('dashboard.upcoming_events')}</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{events.length}</p>
        </div>
        <div
          onClick={() => navigate('/availability')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 transition"
        >
          <p className="text-sm text-gray-500">{t('dashboard.pending_availabilities')}</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{availabilities.length}</p>
        </div>
      </div>

      {/* Prochains événements */}
      <h3 className="text-lg font-bold text-gray-700 mb-3">{t('dashboard.upcoming_events')}</h3>
      {events.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">Aucun événement à venir.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge label={typeLabel[event.type]} color={typeColor[event.type]} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(event.start_at), 'dd MMM', { locale: fr })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Équipes */}
      <h3 className="text-lg font-bold text-gray-700 mb-3">{t('dashboard.teams')}</h3>
      {teams.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucune équipe.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800">{team.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{team.age_group} — {team.season}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}