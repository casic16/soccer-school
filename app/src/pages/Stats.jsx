import { useTranslation } from 'react-i18next'
import { useTeams } from '../hooks/useTeams'
import { useState } from 'react'
import AttendanceStats from '../components/stats/AttendanceStats'

export default function Stats() {
  const { teams } = useTeams()
  const [selectedTeam, setSelectedTeam] = useState('')

  return (
    <div>
      <div className="flex justify-end mb-5">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
          style={{ borderColor: 'hsl(214, 32%, 91%)' }}
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