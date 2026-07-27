import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import { useAuthStore } from '../stores/authStore'
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
  const { profile } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const canCreate = profile?.role === 'admin' || profile?.role === 'coach'

  const handleCreated = (newEvent) => {
    setEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.start_at) - new Date(b.start_at)))
  }

  return (
    <div>
      {profile && canCreate && (
        <div className="flex justify-end mb-5">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm rounded-lg font-semibold transition"
            style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}
          >
            + {t('common.add')}
          </button>
        </div>
      )}

      {profile && canCreate && showForm && (
        <EventForm onClose={() => setShowForm(false)} onCreated={handleCreated} />
      )}

      {loading ? (
        <ListSkeleton rows={4} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Aucun événement à venir"
          description="Les prochains matchs et entraînements apparaîtront ici."
          action={canCreate ? (
            <button onClick={() => setShowForm(true)} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}>
              + Créer un événement
            </button>
          ) : null}
        />
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-4 border flex justify-between items-center hover:shadow-sm transition-shadow duration-200"
              style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${event.type === 'match' ? 'bg-blue-50' : 'bg-green-50'}`}>
                  {typeIcon[event.type]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge label={typeLabel[event.type]} color={typeColor[event.type]} />
                    <span className="text-xs text-slate-400">{event.teams?.name}</span>
                  </div>
                  <h3 className="text-sm font-semibold" style={{ color: 'hsl(222, 47%, 11%)' }}>{event.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {event.location}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold" style={{ color: 'hsl(222, 47%, 11%)' }}>
                  {format(new Date(event.start_at), 'dd MMM', { locale: fr })}
                </p>
                <p className="text-xs text-slate-400">{format(new Date(event.start_at), 'HH:mm')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}