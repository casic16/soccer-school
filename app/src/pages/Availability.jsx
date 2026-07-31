import { useTranslation } from 'react-i18next'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const MARINE = 'hsl(222, 47%, 11%)'

export default function Availability() {
  const { t } = useTranslation()
  const { availabilities, loading, updateStatus } = useAvailabilities()

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">{availabilities.length} réponse{availabilities.length > 1 ? 's' : ''} en attente</p>

      {loading ? <ListSkeleton rows={4} /> : availabilities.length === 0 ? (
        <EmptyState icon="✅" title="Tout est à jour !" description="Aucune présence en attente de confirmation." />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
              <tr>
                {['Événement', 'Joueur', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              {availabilities.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${a.events?.type === 'match' ? 'bg-blue-50' : 'bg-green-50'}`}>
                        {a.events?.type === 'match' ? '⚽' : '🏃'}
                      </div>
                      <div>
                        <p className="font-semibold text-xs" style={{ color: MARINE }}>{a.events?.title}</p>
                        <p className="text-xs text-slate-400">{a.events?.type === 'match' ? 'Match' : 'Entraînement'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' }}>
                        {a.players?.full_name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs font-medium" style={{ color: MARINE }}>{a.players?.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {a.events?.start_at && format(new Date(a.events.start_at), 'dd MMM à HH:mm', { locale: fr })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateStatus(a.id, 'confirmed')}
                        className="px-2.5 py-1 rounded-md text-xs font-bold transition-all"
                        style={{ background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' }}
                      >
                        ✓ Présent
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, 'maybe')}
                        className="px-2.5 py-1 rounded-md text-xs font-bold transition-all"
                        style={{ background: 'hsl(38, 92%, 92%)', color: 'hsl(38, 92%, 30%)' }}
                      >
                        ? Peut-être
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, 'absent')}
                        className="px-2.5 py-1 rounded-md text-xs font-bold transition-all"
                        style={{ background: 'hsl(0, 72%, 93%)', color: 'hsl(0, 72%, 35%)' }}
                      >
                        ✗ Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}