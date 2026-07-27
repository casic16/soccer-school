import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'
import { useNavigate } from 'react-router-dom'
import TeamForm from '../components/teams/TeamForm'
import { CardSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function Teams() {
  const { t } = useTranslation()
  const { teams, loading, setTeams } = useTeams()
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  const handleCreated = (newTeam) => setTeams((prev) => [...prev, newTeam])

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm rounded-lg font-semibold text-white transition"
          style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}
        >
          + {t('common.add')}
        </button>
      </div>

      {showForm && <TeamForm onClose={() => setShowForm(false)} onCreated={handleCreated} />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Aucune équipe"
          description="Créez votre première équipe pour commencer."
          action={<button onClick={() => setShowForm(true)} className="px-4 py-2 text-sm rounded-lg font-semibold text-white" style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}>+ Créer une équipe</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              className="bg-white rounded-xl p-5 border cursor-pointer hover:shadow-md transition-all duration-200"
              style={{ borderColor: 'hsl(214, 32%, 91%)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'hsl(142, 71%, 92%)' }}>⚽</div>
                <div>
                  <h4 className="font-heading font-bold text-sm" style={{ color: 'hsl(222, 47%, 11%)' }}>{team.name}</h4>
                  <p className="text-xs text-slate-400">{team.age_group}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Saison {team.season}</span>
                <span className="text-xs font-semibold" style={{ color: 'hsl(142, 71%, 35%)' }}>{team.players?.[0]?.count || 0} joueurs →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}