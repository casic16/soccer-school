import { useSchools } from '../hooks/useSchools'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

export default function SuperAdmin() {
  const { schools, loading } = useSchools()

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total écoles</p>
          <p className="font-heading font-extrabold text-3xl" style={{ color: MARINE }}>{schools.length}</p>
        </div>
      </div>

      {loading ? <ListSkeleton rows={4} /> : schools.length === 0 ? (
        <EmptyState icon="🏫" title="Aucune école" description="Aucune école enregistrée sur la plateforme." />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'hsl(210, 40%, 98%)', borderBottom: '0.5px solid hsl(214, 32%, 91%)' }}>
              <tr>
                {['École', 'Ville', 'Utilisateurs', 'Créée'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold" style={{ color: MARINE }}>{school.name}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{school.city || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-xs px-2 py-0.5 rounded" style={{ background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' }}>
                      {school.users?.[0]?.count || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
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