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

  const handleCreated = (newTeam) => {
    setTeams((prev) => [...prev, newTeam])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.teams')}</h2>
          <p className="text-sm text-gray-400 mt-1">{teams.length} équipe{teams.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition font-medium flex items-center gap-2"
        >
          <span>+</span> {t('common.add')}
        </button>
      </div>

      {showForm && (
        <TeamForm
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Aucune équipe"
          description="Créez votre première équipe pour commencer à gérer vos joueurs et événements."
          action={
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition"
            >
              + Créer une équipe
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">⚽</div>
                <div>
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                  <p className="text-xs text-gray-400">{team.age_group}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Saison {team.season}</span>
                <span className="text-xs text-green-600 font-medium">
                  {team.players?.[0]?.count || 0} joueurs →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}