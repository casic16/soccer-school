import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'
import { useState } from 'react'
import AttendanceStats from '../components/stats/AttendanceStats'
import { CardSkeleton } from '../components/ui/Skeleton'

export default function Stats() {
  const { t } = useTranslation()
  const { teams, loading } = useTeams()
  const [selectedTeam, setSelectedTeam] = useState('')

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('stats.title')}</h2>
          <p className="text-sm text-gray-400 mt-1">Taux de présence par joueur et événement</p>
        </div>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">Toutes les équipes</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <AttendanceStats teamId={selectedTeam || null} />
    </div>
  )
}