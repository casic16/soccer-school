import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayers } from '../hooks/usePlayers'
import { useTeams } from '../hooks/useTeams'
import Badge from '../components/ui/Badge'

export default function Players() {
  const { t } = useTranslation()
  const { players, loading, addPlayer, deletePlayer } = usePlayers()
  const { teams } = useTeams()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    team_id: '',
    jersey_number: '',
    position: '',
  })
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Joueurs</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
        >
          {showForm ? t('common.cancel') : `+ ${t('common.add')}`}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-700 mb-4">Nouveau joueur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
              <select
                value={form.team_id}
                onChange={(e) => setForm({ ...form, team_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sélectionner...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de maillot</label>
              <input
                type="text"
                value={form.jersey_number}
                onChange={(e) => setForm({ ...form, jersey_number: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : t('common.save')}
          </button>
        </div>
      )}

      {/* Liste des joueurs */}
      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : players.length === 0 ? (
        <p className="text-gray-500">Aucun joueur trouvé.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">#</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nom</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Équipe</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Position</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{player.jersey_number || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{player.full_name}</td>
                  <td className="px-4 py-3">
                    <Badge label={player.teams?.name} color="green" />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{player.position || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deletePlayer(player.id)}
                      className="text-red-400 hover:text-red-600 transition text-xs"
                    >
                      {t('common.delete')}
                    </button>
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