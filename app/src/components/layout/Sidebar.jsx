import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'


const navItems = [
  { path: '/dashboard', label: 'dashboard.title', icon: '🏠' },
  { path: '/teams', label: 'dashboard.teams', icon: '👥' },
  { path: '/events', label: 'dashboard.upcoming_events', icon: '📅' },
  { path: '/availability', label: 'dashboard.pending_availabilities', icon: '✅' },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const { signOut } = useAuthStore()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-green-600">Soccer School</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <span>🚪</span>
          <span>{t('auth.logout')}</span>
        </button>
      </div>
    </aside>
  )
}