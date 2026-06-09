import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../components/ui/Badge'
import EventForm from '../components/events/EventForm'

const typeColor = { match: 'blue', training: 'green', other: 'gray' }
const typeLabel = { match: 'Match', training: 'Entraînement', other: 'Autre' }

export default function Events() {
  const { t } = useTranslation()
  const { events, loading, setEvents } = useEvents()
  const [showForm, setShowForm] = useState(false)

  const handleCreated = (newEvent) => {
    setEvents((prev) => [...prev, newEvent].sort((a, b) =>
      new Date(a.start_at) - new Date(b.start_at)
    ))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.upcoming_events')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
        >
          + {t('common.add')}
        </button>
      </div>

      {showForm && (
        <EventForm
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}

      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">{t('common.no_events')}</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge label={typeLabel[event.type]} color={typeColor[event.type]} />
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