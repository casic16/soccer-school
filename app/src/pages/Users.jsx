import { useTranslation } from 'react-i18next'
import { useUsers } from '../hooks/useUsers'
import { useAuthStore } from '../stores/authStore'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const roleColors = {
  admin: 'bg-blue-100 text-blue-700',
  coach: 'bg-green-100 text-green-700',
  parent: 'bg-yellow-100 text-yellow-700',
  player: 'bg-purple-100 text-purple-700',
}

export default function Users() {
  const { t } = useTranslation()
  const { users, loading, updateRole, deleteUser } = useUsers()
  const { profile } = useAuthStore()

  return (
    <div>
    <p className="text-xs text-slate-400 mb-4">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>

      {loading ? (
        <ListSkeleton rows={4} />
      ) : users.length === 0 ? (
        <EmptyState
          icon="👤"
          title="Aucun utilisateur"
          description="Invitez des coaches, parents et joueurs à rejoindre votre école."
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-sm font-bold text-green-700">
                        {user.full_name?.[0]?.toUpperCase() || '?'}
                      </div>

                      <span className="font-medium text-gray-800">
                        {user.full_name}
                      </span>

                      {user.id === profile?.id && (
                        <span className="text-xs text-gray-400">(moi)</span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      disabled={user.id === profile?.id}
                      className={`text-xs px-2 py-1 rounded-lg font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="coach">Coach</option>
                      <option value="parent">Parent</option>
                      <option value="player">Joueur</option>
                    </select>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {user.id !== profile?.id && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        {t('common.delete')}
                      </button>
                    )}
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