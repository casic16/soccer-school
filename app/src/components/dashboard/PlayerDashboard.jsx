import { useTranslation } from 'react-i18next'
import { useEvents } from '../../hooks/useEvents'
import { useAvailabilities } from '../../hooks/useAvailabilities'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CardSkeleton, ListSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export default function PlayerDashboard() {
  const { t } = useTranslation()
  const { events, loading: eventsLoading } = useEvents()
  const { availabilities, loading: availLoading, updateStatus } = useAvailabilities()

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {eventsLoading ? <CardSkeleton /> : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.upcoming_events')}</p>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{events.length}</p>
          </div>
        )}
        {availLoading ? <CardSkeleton /> : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.pending_availabilities')}</p>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{availabilities.length}</p>
          </div>
        )}
      </div>

      {/* Disponibilités */}
      {availabilities.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-4">Mes disponibilités</h3>
          <div className="space-y-3">
            {availabilities.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-200 bg-yellow-50/30">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-800">{a.events?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.events?.start_at && format(new Date(a.events.start_at), 'dd MMM à HH:mm', { locale: fr })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(a.id, 'confirmed')}
                    className="flex-1 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition font-medium"
                  >
                    ✓ Je viens
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, 'maybe')}
                    className="flex-1 py-2.5 bg-yellow-100 text-yellow-700 text-sm rounded-xl hover:bg-yellow-200 transition font-medium"
                  >
                    ? Peut-être
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, 'absent')}
                    className="flex-1 py-2.5 bg-red-100 text-red-600 text-sm rounded-xl hover:bg-red-200 transition font-medium"
                  >
                    ✗ Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendrier */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-4">Mon calendrier</h3>
        {eventsLoading ? <ListSkeleton rows={3} /> : events.length === 0 ? (
          <EmptyState icon="📅" title="Aucun événement à venir" description="Les prochains matchs et entraînements apparaîtront ici." />
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
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