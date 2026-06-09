import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'
import { useState } from 'react'
import AttendanceStats from '../components/stats/AttendanceStats'

export default function Stats() {
  const { t } = useTranslation()
  const { teams } = useTeams()
  const [selectedTeam, setSelectedTeam] = useState('')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Statistiques</h2>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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