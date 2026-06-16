import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../components/ui/Badge'
import EventForm from '../components/events/EventForm'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const typeColor = { match: 'blue', training: 'green', other: 'gray' }
const typeLabel = { match: 'Match', training: 'Entraînement', other: 'Autre' }
const typeIcon = { match: '⚽', training: '🏃', other: '📌' }

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.upcoming_events')}</h2>
          <p className="text-sm text-gray-400 mt-1">{events.length} événement{events.length > 1 ? 's' : ''} à venir</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition font-medium flex items-center gap-2"
        >
          <span>+</span> {t('common.add')}
        </button>
      </div>

      {showForm && (
        <EventForm
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}

      {loading ? (
        <ListSkeleton rows={4} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Aucun événement à venir"
          description="Planifiez vos prochains matchs et entraînements."
          action={
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition"
            >
              + Créer un événement
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  event.type === 'match' ? 'bg-blue-50' : event.type === 'training' ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  {typeIcon[event.type]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge label={typeLabel[event.type]} color={typeColor[event.type]} />
                    <span className="text-xs text-gray-400">{event.teams?.name}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {event.location}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-700">
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