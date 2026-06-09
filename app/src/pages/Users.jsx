import { useTranslation } from 'react-i18next'
import { useUsers } from '../hooks/useUsers'
import { useAuthStore } from '../stores/authStore'
import Badge from '../components/ui/Badge'

const roleColor = { admin: 'blue', coach: 'green', parent: 'yellow', player: 'gray' }

export default function Users() {
  const { t } = useTranslation()
  const { users, loading, updateRole, deleteUser } = useUsers()
  const { profile } = useAuthStore()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('users.title')}</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nom</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Rôle</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      disabled={user.id === profile?.id}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
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
                        className="text-red-400 hover:text-red-600 transition text-xs"
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