import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'

export default function Teams() {
  const { t } = useTranslation()
  const { teams, loading } = useTeams()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.teams')}</h2>
      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : teams.length === 0 ? (
        <p className="text-gray-500">Aucune équipe trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{team.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{team.age_group} — {team.season}</p>
              <p className="text-sm text-green-600 mt-3 font-medium">
                {team.players?.[0]?.count || 0} joueurs
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}