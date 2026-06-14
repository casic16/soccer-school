import { useTranslation } from 'react-i18next'
import { useSchools } from '../hooks/useSchools'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function SuperAdmin() {
  const { t } = useTranslation()
  const { schools, loading } = useSchools()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Super Admin</h2>
          <p className="text-sm text-gray-500">Vue globale de toutes les écoles Fariki</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total écoles</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{schools.length}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : schools.length === 0 ? (
        <p className="text-gray-500">Aucune école enregistrée.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">École</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Ville</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Utilisateurs</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Créée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{school.name}</td>
                  <td className="px-4 py-3 text-gray-500">{school.city || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{school.users?.[0]?.count || 0}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(school.created_at), { addSuffix: true, locale: fr })}
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