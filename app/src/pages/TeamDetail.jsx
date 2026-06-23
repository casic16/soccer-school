import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '../components/ui/Badge'

const typeColor = { match: 'blue', training: 'green', other: 'gray' }
const typeLabel = { match: 'Match', training: 'Entraînement', other: 'Autre' }

export default function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('players')

  useEffect(() => {
    const fetchData = async () => {
      const [teamRes, playersRes, eventsRes] = await Promise.all([
        supabase.from('teams').select('*').eq('id', id).single(),
        supabase.from('players').select('*').eq('team_id', id).order('full_name'),
        supabase.from('events').select('*').eq('team_id', id).gte('start_at', new Date().toISOString()).order('start_at'),
      ])
      setTeam(teamRes.data)
      setPlayers(playersRes.data || [])
      setEvents(eventsRes.data || [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>
  if (!team) return <p className="text-gray-500">Équipe introuvable.</p>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
  <button
    onClick={() => navigate('/teams')}
    className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all"
  >
    ←
  </button>
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">⚽</div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
      <p className="text-sm text-gray-400">{team.age_group} — {team.season}</p>
    </div>
  </div>
</div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100">
        <button
          onClick={() => setTab('players')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'players'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ⚽ Joueurs ({players.length})
        </button>
        <button
          onClick={() => setTab('events')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'events'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📅 Événements ({events.length})
        </button>
      </div>

      {/* Joueurs */}
      {tab === 'players' && (
        players.length === 0 ? (
          <p className="text-gray-500">Aucun joueur dans cette équipe.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">#</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Nom</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{player.jersey_number || '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{player.full_name}</td>
                    <td className="px-4 py-3 text-gray-500">{player.position || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Événements */}
      {tab === 'events' && (
        events.length === 0 ? (
          <p className="text-gray-500">Aucun événement à venir pour cette équipe.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={typeLabel[event.type]} color={typeColor[event.type]} />
                  </div>
                  <h3 className="text-gray-800 font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{event.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {format(new Date(event.start_at), 'dd MMM', { locale: fr })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(event.start_at), 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}