import { useTranslation } from 'react-i18next'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const typeIcon = { match: '⚽', training: '🏃', other: '📌' }
const statusConfig = {
  confirmed: { label: 'Présent', color: 'bg-green-100 text-green-700' },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-700' },
  maybe: { label: 'Peut-être', color: 'bg-yellow-100 text-yellow-700' },
  pending: { label: 'En attente', color: 'bg-gray-100 text-gray-600' },
}

export default function Availability() {
  const { t } = useTranslation()
  const { availabilities, loading, updateStatus } = useAvailabilities()

  return (
    <div>
              <p className="text-sm text-gray-400 mt-1">{availabilities.length} réponse{availabilities.length > 1 ? 's' : ''} en attente</p>
      </div>

      {loading ? (
        <ListSkeleton rows={3} />
      ) : availabilities.length === 0 ? (
        <EmptyState
          icon="✅"
          title="Tout est à jour !"
          description="Aucune présence en attente de confirmation."
        />
      ) : (
        <div className="space-y-3">
          {availabilities.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    a.events?.type === 'match' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    {typeIcon[a.events?.type] || '📌'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{a.events?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.events?.start_at && format(new Date(a.events.start_at), 'dd MMM à HH:mm', { locale: fr })}
                    </p>
                    {a.players?.full_name && (
                      <p className="text-xs text-gray-400">Joueur : {a.players.full_name}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(a.id, 'confirmed')}
                  className="flex-1 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition font-medium"
                >
                  ✓ Présent
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
      )}
    </div>
  )
}