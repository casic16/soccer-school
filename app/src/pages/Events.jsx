import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Events() {
  const { t } = useTranslation()
  const { events, loading } = useEvents()

  const eventTypeColor = {
    match: 'bg-blue-100 text-blue-700',
    training: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
  }

  const eventTypeLabel = {
    match: 'Match',
    training: 'Entraînement',
    other: 'Autre',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.upcoming_events')}</h2>
      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">Aucun événement à venir.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventTypeColor[event.type]}`}>
                    {eventTypeLabel[event.type]}
                  </span>
                  <span className="text-xs text-gray-400">{event.teams?.name}</span>
                </div>
                <h3 className="text-gray-800 font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{event.location}</p>
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
  )
}