import { useTranslation } from 'react-i18next'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const MARINE = 'hsl(222, 47%, 11%)'

export default function Notifications() {
  const { profile } = useAuthStore()
  const { notifications, loading, markAllRead, markRead, unreadCount } = useNotificationStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400">
          {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead(profile?.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            style={{ background: 'hsl(142, 71%, 92%)', color: 'hsl(142, 71%, 25%)' }}
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {loading ? <ListSkeleton rows={4} /> : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="Aucune notification" description="Vous recevrez ici les annonces et rappels importants." />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          {notifications.map((n, i) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                i < notifications.length - 1 ? 'border-b' : ''
              } ${!n.is_read ? 'bg-green-50/50' : ''}`}
              style={{ borderColor: 'hsl(214, 32%, 91%)' }}
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${!n.is_read ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: MARINE }}>{n.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDistanceToNow(new Date(n.sent_at), { addSuffix: true, locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}