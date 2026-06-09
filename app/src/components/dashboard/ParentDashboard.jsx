import { useTranslation } from 'react-i18next'
import { useEvents } from '../../hooks/useEvents'
import { useAvailabilities } from '../../hooks/useAvailabilities'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../ui/Badge'

const typeColor = { match: 'blue', training: 'green', other: 'gray' }
const typeLabel = { match: 'Match', training: 'Entraînement', other: 'Autre' }
const statusColor = { confirmed: 'green', absent: 'red', pending: 'yellow', maybe: 'gray' }
const statusLabel = { confirmed: 'Présent', absent: 'Absent', pending: 'En attente', maybe: 'Peut-être' }

export default function ParentDashboard() {
  const { t } = useTranslation()
  const { events } = useEvents()
  const { availabilities, updateStatus } = useAvailabilities()

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">{t('dashboard.upcoming_events')}</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{events.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">{t('dashboard.pending_availabilities')}</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">{availabilities.length}</p>
        </div>
      </div>

      {/* Présences à confirmer */}
      {availabilities.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-gray-700 mb-3">À confirmer</h3>
          <div className="space-y-3 mb-8">
            {availabilities.map((a) => (
              <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-yellow-200 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.events?.title}</p>
                  <p className="text-xs text-gray-400">
                    {a.events?.start_at && format(new Date(a.events.start_at), 'dd MMM HH:mm', { locale: fr })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(a.id, 'confirmed')} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">✓</button>
                  <button onClick={() => updateStatus(a.id, 'maybe')} className="px-3 py-1.5 bg-yellow-100 text-yellow-600 text-sm rounded-lg hover:bg-yellow-200 transition">?</button>
                  <button onClick={() => updateStatus(a.id, 'absent')} className="px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition">✗</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Prochains événements */}
      <h3 className="text-lg font-bold text-gray-700 mb-3">{t('dashboard.upcoming_events')}</h3>
      <div className="space-y-3">
        {events.map((event) => (
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
    </div>
  )
}