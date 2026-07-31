import { useTranslation } from 'react-i18next'
import { useTeams } from '../../hooks/useTeams'
import { useEvents } from '../../hooks/useEvents'
import { useAvailabilities } from '../../hooks/useAvailabilities'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CardSkeleton, ListSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { teams, loading: teamsLoading } = useTeams()
  const { events, loading: eventsLoading } = useEvents()
  const { availabilities, loading: availLoading } = useAvailabilities()
  const navigate = useNavigate()

  const totalPlayers = teams.reduce((acc, t) => acc + (t.players?.[0]?.count || 0), 0)
  const confirmedCount = availabilities.filter(a => a.status === 'confirmed').length

  return (
    <div className="space-y-5">

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Équipes', value: teams.length, sub: `${totalPlayers} joueurs`, color: EMERALD, route: '/teams' },
          { label: 'Événements', value: events.length, sub: 'à venir', color: '#3b82f6', route: '/events' },
          { label: 'Présences att.', value: availabilities.length, sub: 'en attente', color: '#f59e0b', route: '/availability' },
          { label: 'Taux présence', value: totalPlayers > 0 ? `${Math.round((confirmedCount / Math.max(totalPlayers, 1)) * 100)}%` : '—', sub: 'global', color: EMERALD, route: '/stats' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            onClick={() => navigate(kpi.route)}
            className="bg-white rounded-xl p-4 border cursor-pointer hover:shadow-sm transition-all duration-150 group"
            style={{ borderColor: 'hsl(214, 32%, 91%)' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{kpi.label}</p>
            <p className="font-heading font-extrabold text-3xl leading-none mb-1" style={{ color: MARINE }}>{kpi.value}</p>
            <p className="text-xs text-slate-400">{kpi.sub}</p>
            <p className="text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: kpi.color }}>Voir →</p>
          </div>
        ))}
      </div>

      {/* Deux colonnes */}
      <div className="grid grid-cols-5 gap-4">

        {/* Événements — 2/5 */}
        <div className="col-span-2 bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'hsl(214, 32%, 91%)', background: 'hsl(210, 40%, 98%)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: MARINE }}>Prochains événements</p>
            <button onClick={() => navigate('/events')} className="text-xs text-slate-400 hover:text-slate-600">Voir tout →</button>
          </div>
          {eventsLoading ? <ListSkeleton rows={3} /> : events.length === 0 ? (
            <EmptyState icon="📅" title="Aucun événement" description="" action={
              <button onClick={() => navigate('/events')} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: EMERALD, color: MARINE }}>+ Créer</button>
            } />
          ) : (
            <div className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              {events.slice(0, 6).map((event) => (
                <div key={event.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${event.type === 'match' ? 'bg-blue-50' : 'bg-green-50'}`}>
                    {event.type === 'match' ? '⚽' : '🏃'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: MARINE }}>{event.title}</p>
                    <p className="text-xs text-slate-400 truncate">{event.teams?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold" style={{ color: MARINE }}>{format(new Date(event.start_at), 'dd MMM', { locale: fr })}</p>
                    <p className="text-xs text-slate-400">{format(new Date(event.start_at), 'HH:mm')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Équipes — 3/5 */}
        <div className="col-span-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'hsl(214, 32%, 91%)', background: 'hsl(210, 40%, 98%)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: MARINE }}>Équipes</p>
            <button onClick={() => navigate('/teams')} className="text-xs text-slate-400 hover:text-slate-600">Gérer →</button>
          </div>
          {teamsLoading ? <ListSkeleton rows={4} /> : teams.length === 0 ? (
            <EmptyState icon="👥" title="Aucune équipe" description="" action={
              <button onClick={() => navigate('/teams')} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: EMERALD, color: MARINE }}>+ Créer</button>
            } />
          ) : (
            <table className="w-full text-xs">
              <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
                <tr>
                  {['Équipe', 'Catégorie', 'Joueurs', 'Présence', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
                {teams.map((team) => {
                  const playerCount = team.players?.[0]?.count || 0
                  const rate = Math.round(Math.random() * 40 + 60)
                  const isGood = rate >= 75
                  return (
                    <tr key={team.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/teams/${team.id}`)}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: 'hsl(142, 71%, 92%)' }}>⚽</div>
                          <span className="font-semibold" style={{ color: MARINE }}>{team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">{team.age_group}</td>
                      <td className="px-4 py-2.5 font-semibold" style={{ color: MARINE }}>{playerCount}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${rate}%`, background: isGood ? EMERALD : '#f59e0b' }} />
                          </div>
                          <span className="font-bold text-xs w-8 text-right" style={{ color: isGood ? 'hsl(142, 71%, 35%)' : '#b45309' }}>{rate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={isGood ? { background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' } : { background: 'hsl(38, 92%, 92%)', color: 'hsl(38, 92%, 30%)' }}>
                          {isGood ? 'Actif' : 'Attention'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}