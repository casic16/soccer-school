import { useTranslation } from 'react-i18next'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Notifications() {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const { notifications, loading, markAllRead, markRead, unreadCount } = useNotificationStore()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead(profile?.id)}
            className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition ${
                !n.is_read ? 'border-green-200 bg-green-50' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-800 flex-1">{n.message}</p>
                {!n.is_read && (
                  <span className="w-2 h-2 bg-green-500 rounded-full ml-3 mt-1 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(n.sent_at), { addSuffix: true, locale: fr })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}