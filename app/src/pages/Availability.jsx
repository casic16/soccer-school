import { useTranslation } from 'react-i18next'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../components/ui/Badge'

const typeColor = {
  match: 'blue',
  training: 'green',
  other: 'gray',
}

const typeLabel = {
  match: 'Match',
  training: 'Entraînement',
  other: 'Autre',
}

export default function Availability() {
  const { t } = useTranslation()
  const { availabilities, loading, updateStatus } = useAvailabilities()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t('dashboard.pending_availabilities')}
      </h2>
      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : availabilities.length === 0 ? (
        <p className="text-gray-500">Aucune présence en attente.</p>
      ) : (
        <div className="space-y-3">
          {availabilities.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge label={typeLabel[a.events?.type]} color={typeColor[a.events?.type]} />
                  <span className="text-xs text-gray-400">
                    {a.events?.start_at && format(new Date(a.events.start_at), 'dd MMM HH:mm', { locale: fr })}
                  </span>
                </div>
                <h3 className="text-gray-800 font-medium">{a.events?.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Joueur : {a.players?.full_name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(a.id, 'confirmed')}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Présent
                </button>
                <button
                  onClick={() => updateStatus(a.id, 'absent')}
                  className="px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition"
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