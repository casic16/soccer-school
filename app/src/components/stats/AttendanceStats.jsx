import { useStats } from '../../hooks/useStats'
import { useTranslation } from 'react-i18next'

const statusColor = {
  confirmed: 'bg-green-500',
  absent: 'bg-red-400',
  maybe: 'bg-yellow-400',
  pending: 'bg-gray-300',
}

function ProgressBar({ confirmed, absent, maybe, pending, total }) {
  if (total === 0) return null
  return (
    <div className="flex h-2 rounded-full overflow-hidden w-full">
      <div className="bg-green-500" style={{ width: `${(confirmed / total) * 100}%` }} />
      <div className="bg-red-400" style={{ width: `${(absent / total) * 100}%` }} />
      <div className="bg-yellow-400" style={{ width: `${(maybe / total) * 100}%` }} />
      <div className="bg-gray-300" style={{ width: `${(pending / total) * 100}%` }} />
    </div>
  )
}

export default function AttendanceStats({ teamId = null }) {
  const { t } = useTranslation()
  const { stats, loading } = useStats(teamId)

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>

  const { summary, byPlayer, byEvent } = stats

  return (
    <div className="space-y-8">
      {/* Résumé global */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{summary.confirmed}</p>
          <p className="text-xs text-gray-500 mt-1">Présents</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-red-500">{summary.absent}</p>
          <p className="text-xs text-gray-500 mt-1">Absents</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-yellow-500">{summary.maybe}</p>
          <p className="text-xs text-gray-500 mt-1">Peut-être</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-400">{summary.pending}</p>
          <p className="text-xs text-gray-500 mt-1">En attente</p>
        </div>
      </div>

      {/* Stats par joueur */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-3">Présences par joueur</h3>
        {byPlayer.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune donnée.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Joueur</th>
                  <th className="text-center px-3 py-3 text-green-600 font-medium">✓</th>
                  <th className="text-center px-3 py-3 text-red-500 font-medium">✗</th>
                  <th className="text-center px-3 py-3 text-yellow-500 font-medium">?</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-32">Taux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {byPlayer.map((p) => (
                  <tr key={p.name} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-3 py-3 text-center text-green-600 font-medium">{p.confirmed}</td>
                    <td className="px-3 py-3 text-center text-red-500 font-medium">{p.absent}</td>
                    <td className="px-3 py-3 text-center text-yellow-500 font-medium">{p.maybe}</td>
                    <td className="px-4 py-3">
                      <ProgressBar {...p} />
                      <p className="text-xs text-gray-400 mt-1">
                        {p.total > 0 ? Math.round((p.confirmed / p.total) * 100) : 0}%
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats par événement */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-3">Présences par événement</h3>
        {byEvent.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune donnée.</p>
        ) : (
          <div className="space-y-3">
            {byEvent.map((e) => (
              <div key={e.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-400">{e.confirmed}/{e.total} présents</p>
                </div>
                <ProgressBar {...e} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}