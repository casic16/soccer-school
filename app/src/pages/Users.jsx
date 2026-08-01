import { useTranslation } from 'react-i18next'
import { useUsers } from '../hooks/useUsers'
import { useAuthStore } from '../stores/authStore'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

const roleColors = {
  admin: { bg: 'hsl(217, 91%, 92%)', color: 'hsl(217, 91%, 30%)' },
  coach: { bg: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' },
  parent: { bg: 'hsl(38, 92%, 92%)', color: 'hsl(38, 92%, 30%)' },
  player: { bg: 'hsl(270, 70%, 92%)', color: 'hsl(270, 70%, 35%)' },
}

export default function Users() {
  const { t } = useTranslation()
  const { users, loading, updateRole, deleteUser } = useUsers()
  const { profile } = useAuthStore()

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>

      {loading ? <ListSkeleton rows={4} /> : users.length === 0 ? (
        <EmptyState icon="👤" title="Aucun utilisateur" description="Invitez des coaches, parents et joueurs à rejoindre votre école." />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <table className="w-full text-xs">
            <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
              <tr>
                {['Utilisateur', 'Email', 'Rôle', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              {users.map((user) => {
                const rc = roleColors[user.role] || { bg: '#f1f5f9', color: '#64748b' }
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: EMERALD + '22', color: 'hsl(142, 71%, 25%)' }}>
                          {user.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <span className="font-semibold" style={{ color: MARINE }}>{user.full_name}</span>
                          {user.id === profile?.id && <span className="ml-1.5 text-slate-400">(moi)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        disabled={user.id === profile?.id}
                        className="text-xs px-2 py-1 rounded-md font-bold border-0 cursor-pointer focus:outline-none disabled:opacity-50"
                        style={{ background: rc.bg, color: rc.color }}
                      >
                        <option value="admin">Admin</option>
                        <option value="coach">Coach</option>
                        <option value="parent">Parent</option>
                        <option value="player">Joueur</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.id !== profile?.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-xs text-slate-300 hover:text-red-500 transition-colors"
                        >
                          {t('common.delete')}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}