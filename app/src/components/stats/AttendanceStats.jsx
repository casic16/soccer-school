import { useStats } from '../../hooks/useStats'
import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-lg text-xs" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
        <p className="font-bold mb-1" style={{ color: MARINE }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name} : {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AttendanceStats({ teamId = null }) {
  const { t } = useTranslation()
  const { stats, loading } = useStats(teamId)

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  )

  const { summary, byPlayer, byEvent } = stats

  const pieData = [
    { name: 'Présents', value: summary.confirmed, color: EMERALD },
    { name: 'Absents', value: summary.absent, color: '#ef4444' },
    { name: 'Peut-être', value: summary.maybe, color: '#f59e0b' },
    { name: 'En attente', value: summary.pending, color: '#e2e8f0' },
  ].filter(d => d.value > 0)

  const barData = byPlayer.slice(0, 10).map(p => ({
    name: p.name.split(' ').slice(-1)[0],
    fullName: p.name,
    confirmed: p.confirmed,
    absent: p.absent,
    maybe: p.maybe,
    taux: p.total > 0 ? Math.round((p.confirmed / p.total) * 100) : 0,
  }))

  const totalRate = summary.total > 0
    ? Math.round((summary.confirmed / summary.total) * 100)
    : 0

  return (
    <div className="space-y-4">

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: summary.total, color: MARINE },
          { label: 'Présents', value: summary.confirmed, color: EMERALD },
          { label: 'Absents', value: summary.absent, color: '#ef4444' },
          { label: 'Peut-être', value: summary.maybe, color: '#f59e0b' },
          { label: 'Taux global', value: `${totalRate}%`, color: totalRate >= 75 ? EMERALD : '#f59e0b' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-4 border" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{kpi.label}</p>
            <p className="font-heading font-extrabold text-2xl" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-4">

        {/* Bar chart joueurs */}
        <div className="col-span-2 bg-white rounded-xl border p-4" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Présences par joueur (top 10)</p>
          {barData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="confirmed" name="Présents" fill={EMERALD} radius={[3, 3, 0, 0]} />
                <Bar dataKey="absent" name="Absents" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="maybe" name="Peut-être" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Répartition globale</p>
          {pieData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tableau joueurs */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'hsl(214, 32%, 91%)', background: 'hsl(210, 40%, 98%)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: MARINE }}>Détail par joueur</p>
        </div>
        {byPlayer.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucune donnée disponible</p>
        ) : (
          <table className="w-full text-xs">
            <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
              <tr>
                {['Joueur', '✓ Présents', '✗ Absents', '? Peut-être', 'Taux'].map(h => (
                  <th key={h} className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              {byPlayer.map((p) => {
                const rate = p.total > 0 ? Math.round((p.confirmed / p.total) * 100) : 0
                const isGood = rate >= 75
                return (
                  <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-semibold" style={{ color: MARINE }}>{p.name}</td>
                    <td className="px-4 py-2.5 font-bold" style={{ color: EMERALD }}>{p.confirmed}</td>
                    <td className="px-4 py-2.5 font-bold text-red-500">{p.absent}</td>
                    <td className="px-4 py-2.5 font-bold text-amber-500">{p.maybe}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full" style={{ width: `${rate}%`, background: isGood ? EMERALD : '#f59e0b' }} />
                        </div>
                        <span className="font-bold w-8" style={{ color: isGood ? 'hsl(142, 71%, 35%)' : '#b45309' }}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}