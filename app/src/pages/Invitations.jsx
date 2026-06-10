import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvitations } from '../hooks/useInvitations'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const roleColor = { admin: 'blue', coach: 'green', parent: 'yellow', player: 'gray' }

export default function Invitations() {
  const { t } = useTranslation()
  const { invitations, loading, createInvitation, deleteInvitation } = useInvitations()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('parent')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)

  const handleInvite = async () => {
    if (!email) return
    setSaving(true)
    setError(null)
    const { data, error } = await createInvitation(email, role)
    if (error) setError(error.message)
    setEmail('')
    setSaving(false)
  }

  const copyLink = (token) => {
    const link = `${window.location.origin}/register?token=${token}`
    navigator.clipboard.writeText(link)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Invitations</h2>

      {/* Formulaire */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-700 mb-4">Inviter un utilisateur</h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="parent">Parent</option>
            <option value="player">Joueur</option>
            <option value="coach">Coach</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={saving || !email}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Envoi...' : 'Inviter'}
          </button>
        </div>
      </div>

      {/* Liste des invitations */}
      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : invitations.length === 0 ? (
        <p className="text-gray-500">Aucune invitation envoyée.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Rôle</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Statut</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Expire</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{inv.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-${roleColor[inv.role]}-100 text-${roleColor[inv.role]}-700`}>
                      {inv.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {inv.accepted_at ? (
                      <span className="text-xs text-green-600 font-medium">✓ Acceptée</span>
                    ) : new Date(inv.expires_at) < new Date() ? (
                      <span className="text-xs text-red-500 font-medium">Expirée</span>
                    ) : (
                      <span className="text-xs text-yellow-600 font-medium">En attente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDistanceToNow(new Date(inv.expires_at), { addSuffix: true, locale: fr })}
                  </td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    {!inv.accepted_at && (
                      <button
                        onClick={() => copyLink(inv.token)}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        {copied === inv.token ? '✓ Copié' : 'Copier lien'}
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvitation(inv.id)}
                      className="text-xs text-red-400 hover:text-red-600"
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