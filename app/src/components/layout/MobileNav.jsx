import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'

const allNavItems = [
  { path: '/dashboard', icon: '🏠', roles: ['admin', 'coach', 'parent', 'player', 'super_admin'] },
  { path: '/teams', icon: '👥', roles: ['admin', 'coach'] },
  { path: '/events', icon: '📅', roles: ['admin', 'coach', 'parent', 'player'] },
  { path: '/availability', icon: '✅', roles: ['admin', 'coach', 'parent', 'player'] },
  { path: '/notifications', icon: '🔔', roles: ['admin', 'coach', 'parent', 'player'] },
]

export default function MobileNav() {
  const { profile } = useAuthStore()
  const { unreadCount } = useNotificationStore()

  const navItems = allNavItems.filter(item => item.roles.includes(profile?.role))

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-150 relative ${
                isActive ? 'bg-green-50' : ''
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.path === '/notifications' && unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}