import { useTranslation } from 'react-i18next'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function Notifications() {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const { notifications, loading, markAllRead, markRead, unreadCount } = useNotificationStore()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead(profile?.id)}
            className="px-4 py-2 text-sm text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition font-medium"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {loading ? (
        <ListSkeleton rows={4} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="Aucune notification"
          description="Vous recevrez ici les annonces et rappels importants."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-all duration-200 ${
                !n.is_read ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.is_read ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <p className="text-sm text-gray-800">{n.message}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">
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