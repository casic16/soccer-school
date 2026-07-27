import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayers } from '../hooks/usePlayers'
import { useTeams } from '../hooks/useTeams'
import Badge from '../components/ui/Badge'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function Players() {
  const { t } = useTranslation()
  const { players, loading, addPlayer, deletePlayer } = usePlayers()
  const { teams } = useTeams()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ full_name: '', team_id: '', jersey_number: '', position: '' })
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!form.full_name || !form.team_id) return
    setSaving(true)
    await addPlayer(form)
    setForm({ full_name: '', team_id: '', jersey_number: '', position: '' })
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm rounded-lg font-semibold transition"
          style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}
        >
          {showForm ? t('common.cancel') : `+ ${t('common.add')}`}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 border mb-5" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <h3 className="font-heading font-bold text-sm mb-4" style={{ color: 'hsl(222, 47%, 11%)' }}>Nouveau joueur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Nom complet *', key: 'full_name', type: 'text' },
              { label: 'Numéro', key: 'jersey_number', type: 'text' },
              { label: 'Position', key: 'position', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'hsl(214, 32%, 91%)', '--tw-ring-color': 'hsl(142, 71%, 45%)' }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Équipe *</label>
              <select
                value={form.team_id}
                onChange={(e) => setForm({ ...form, team_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'hsl(214, 32%, 91%)' }}
              >
                <option value="">Sélectionner...</option>
                {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="mt-4 px-4 py-2 text-sm rounded-lg font-semibold disabled:opacity-50"
            style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}
          >
            {saving ? 'Enregistrement...' : t('common.save')}
          </button>
        </div>
      )}

      {loading ? <ListSkeleton rows={4} /> : players.length === 0 ? (
        <EmptyState icon="⚽" title="Aucun joueur" description="Ajoutez des joueurs à vos équipes."
          action={<button onClick={() => setShowForm(true)} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}>+ Ajouter</button>}
        />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
              <tr>
                {['#', 'Nom', 'Équipe', 'Position', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-400 text-xs">{player.jersey_number || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' }}>
                        {player.full_name[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold" style={{ color: 'hsl(222, 47%, 11%)' }}>{player.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge label={player.teams?.name} color="green" /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{player.position || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deletePlayer(player.id)} className="text-xs text-slate-300 hover:text-red-500 transition-colors">{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}