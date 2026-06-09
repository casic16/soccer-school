import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'
import { useNavigate } from 'react-router-dom'
import TeamForm from '../components/teams/TeamForm'

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.teams')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
        >
          + {t('common.add')}
        </button>
      </div>

      {showForm && (
        <TeamForm
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}

      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : teams.length === 0 ? (
        <p className="text-gray-500">{t('common.no_teams')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{team.name}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {team.age_group}
                </span>
              </div>
              <p className="text-sm text-gray-500">Saison : {team.season}</p>
              <p className="text-sm text-green-600 mt-3 font-medium">
                {team.players?.[0]?.count || 0} joueurs →
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}