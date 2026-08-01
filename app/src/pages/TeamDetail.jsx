import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

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

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  )
  if (!team) return <p className="text-slate-400 text-sm">Équipe introuvable.</p>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/teams')}
          className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all text-sm"
          style={{ borderColor: 'hsl(214, 32%, 91%)' }}
        >
          ←
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'hsl(142, 71%, 92%)' }}>⚽</div>
          <div>
            <h2 className="font-heading font-bold text-lg" style={{ color: MARINE }}>{team.name}</h2>
            <p className="text-xs text-slate-400">{team.age_group} — Saison {team.season}</p>
          </div>
        </div>
        {/* Stats rapides */}
        <div className="ml-auto flex gap-3">
          {[
            { label: 'Joueurs', value: players.length },
            { label: 'Événements', value: events.length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg px-4 py-2 border text-center" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              <p className="font-heading font-extrabold text-xl" style={{ color: MARINE }}>{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
        {[
          { key: 'players', label: `Joueurs (${players.length})` },
          { key: 'events', label: `Événements (${events.length})` },
        ].map(tab_ => (
          <button
            key={tab_.key}
            onClick={() => setTab(tab_.key)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px ${
              tab === tab_.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            style={ tab === tab_.key ? { borderColor: EMERALD, color: 'hsl(142, 71%, 35%)' } : {}}
          >
            {tab_.label}
          </button>
        ))}
      </div>

      {/* Joueurs */}
      {tab === 'players' && (
        players.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚽</p>
            <p className="font-semibold text-slate-600">Aucun joueur dans cette équipe</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
            <table className="w-full text-xs">
              <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
                <tr>
                  {['#', 'Nom', 'Position', 'Naissance'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{player.jersey_number || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' }}>
                          {player.full_name[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold" style={{ color: MARINE }}>{player.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{player.position || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {player.date_of_birth ? format(new Date(player.date_of_birth), 'dd MMM yyyy', { locale: fr }) : '—'}
                    </td>
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
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-semibold text-slate-600">Aucun événement à venir</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
            <table className="w-full text-xs">
              <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
                <tr>
                  {['Type', 'Titre', 'Lieu', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${event.type === 'match' ? 'bg-blue-50' : 'bg-green-50'}`}>
                        {event.type === 'match' ? '⚽' : '🏃'}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: MARINE }}>{event.title}</td>
                    <td className="px-4 py-3 text-slate-400">{event.location || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {format(new Date(event.start_at), 'dd MMM à HH:mm', { locale: fr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}