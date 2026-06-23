import { useTranslation } from 'react-i18next'
import { useTeams } from '../../hooks/useTeams'
import { useEvents } from '../../hooks/useEvents'
import { useAvailabilities } from '../../hooks/useAvailabilities'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../ui/Badge'
import { CardSkeleton, ListSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

const typeColor = { match: 'blue', training: 'green', other: 'gray' }
const statusConfig = {
  confirmed: { label: 'Présent', color: 'bg-green-100 text-green-700' },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-700' },
  maybe: { label: 'Peut-être', color: 'bg-yellow-100 text-yellow-700' },
  pending: { label: 'En attente', color: 'bg-gray-100 text-gray-600' },
}

export default function CoachDashboard() {
  const { t } = useTranslation()
  const { teams, loading: teamsLoading } = useTeams()
  const { events, loading: eventsLoading } = useEvents()
  const { availabilities, loading: availLoading } = useAvailabilities()
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamsLoading ? <CardSkeleton /> : (
          <div
            onClick={() => navigate('/teams')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">Mes équipes</p>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teams.length}</p>
            <p className="text-xs text-green-600 mt-2 group-hover:underline">Voir les équipes →</p>
          </div>
        )}

        {eventsLoading ? <CardSkeleton /> : (
          <div
            onClick={() => navigate('/events')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.upcoming_events')}</p>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{events.length}</p>
            <p className="text-xs text-blue-600 mt-2 group-hover:underline">Voir les événements →</p>
          </div>
        )}

        {availLoading ? <CardSkeleton /> : (
          <div
            onClick={() => navigate('/availability')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-yellow-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.pending_availabilities')}</p>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{availabilities.length}</p>
            <p className="text-xs text-yellow-600 mt-2 group-hover:underline">Voir les présences →</p>
          </div>
        )}
      </div>

      {/* Présences récentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Présences récentes</h3>
          <button onClick={() => navigate('/availability')} className="text-xs text-green-600 hover:underline">Voir tout</button>
        </div>
        {availLoading ? <ListSkeleton rows={3} /> : availabilities.length === 0 ? (
          <EmptyState icon="✅" title="Aucune présence en attente" description="Tous les joueurs ont répondu." />
        ) : (
          <div className="space-y-2">
            {availabilities.slice(0, 5).map((a) => (
              <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-sm font-bold text-green-700">
                    {a.players?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.players?.full_name}</p>
                    <p className="text-xs text-gray-400">{a.events?.title}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusConfig[a.status]?.color}`}>
                  {statusConfig[a.status]?.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prochains événements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">{t('dashboard.upcoming_events')}</h3>
          <button onClick={() => navigate('/events')} className="text-xs text-green-600 hover:underline">Voir tout</button>
        </div>
        {eventsLoading ? <ListSkeleton rows={3} /> : events.length === 0 ? (
          <EmptyState icon="📅" title="Aucun événement à venir" description="Créez un match ou un entraînement." action={
            <button onClick={() => navigate('/events')} className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition">
              + Créer un événement
            </button>
          } />
        ) : (
          <div className="space-y-2">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    event.type === 'match' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    {event.type === 'match' ? '⚽' : '🏃'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {format(new Date(event.start_at), 'dd MMM', { locale: fr })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(event.start_at), 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}