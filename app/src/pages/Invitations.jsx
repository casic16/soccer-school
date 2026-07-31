import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvitations } from '../hooks/useInvitations'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const roleColors = {
  admin: 'bg-blue-100 text-blue-700',
  coach: 'bg-green-100 text-green-700',
  parent: 'bg-yellow-100 text-yellow-700',
  player: 'bg-purple-100 text-purple-700',
}

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
    const { error } = await createInvitation(email, role)
    if (error) setError(error.message)
    setEmail('')
    setSaving(false)
  }

  const copyLink = (token) => {
    const link = `${window.location.origin}/register?token=${token}`
    try {
      navigator.clipboard.writeText(link)
    } catch {
      const el = document.createElement('textarea')
      el.value = link
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mt-1">
        {invitations.length} invitation{invitations.length > 1 ? 's' : ''}
      </p>

      {/* Formulaire */}
<div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Inviter un utilisateur</p>
  {error && <p className="text-red-500 text-xs mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}
  <div className="flex gap-2">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="email@exemple.com"
      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
      style={{ borderColor: 'hsl(214, 32%, 91%)' }}
    />
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
      style={{ borderColor: 'hsl(214, 32%, 91%)' }}
    >
      <option value="parent">Parent</option>
      <option value="player">Joueur</option>
      <option value="coach">Coach</option>
    </select>
    <button
      onClick={handleInvite}
      disabled={saving || !email}
      className="px-4 py-2 text-sm rounded-lg font-semibold disabled:opacity-50 transition"
      style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}
    >
      {saving ? 'Envoi...' : 'Inviter'}
    </button>
  </div>
</div>

      {/* Liste */}
      {loading ? (
        <ListSkeleton rows={3} />
      ) : invitations.length === 0 ? (
        <EmptyState
          icon="✉️"
          title="Aucune invitation"
          description="Invitez des coaches, parents et joueurs à rejoindre votre école."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Rôle
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Expire
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {inv.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        roleColors[inv.role] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {inv.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {inv.accepted_at ? (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Acceptée
                      </span>
                    ) : new Date(inv.expires_at) < new Date() ? (
                      <span className="text-xs text-red-500 font-medium">
                        Expirée
                      </span>
                    ) : (
                      <span className="text-xs text-yellow-600 font-medium">
                        En attente
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(inv.expires_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </td>

                  <td className="px-5 py-4 text-right flex gap-3 justify-end">
                    {!inv.accepted_at && (
                      <button
                        onClick={() => copyLink(inv.token)}
                        className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        {copied === inv.token ? '✓ Copié' : 'Copier lien'}
                      </button>
                    )}

                    <button
                      onClick={() => deleteInvitation(inv.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
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