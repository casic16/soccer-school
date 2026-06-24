import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'

const allNavItems = [
  { path: '/dashboard', label: 'dashboard.title', icon: '🏠', roles: ['admin', 'coach', 'parent', 'player', 'super_admin'] },
  { path: '/teams', label: 'dashboard.teams', icon: '👥', roles: ['admin', 'coach'] },
  { path: '/events', label: 'dashboard.upcoming_events', icon: '📅', roles: ['admin', 'coach', 'parent', 'player'] },
  { path: '/players', label: 'players.title', icon: '⚽', roles: ['admin', 'coach'] },
  { path: '/availability', label: 'dashboard.pending_availabilities', icon: '✅', roles: ['admin', 'coach', 'parent', 'player'] },
  { path: '/stats', label: 'stats.title', icon: '📊', roles: ['admin', 'coach'] },
  { path: '/invitations', label: 'invitations.title', icon: '✉️', roles: ['admin'] },
  { path: '/users', label: 'users.title', icon: '🔑', roles: ['admin'] },
  { path: '/notifications', label: 'notifications.title', icon: '🔔', roles: ['admin', 'coach', 'parent', 'player'] },
  { path: '/super-admin', label: 'superadmin.title', icon: '🌐', roles: ['super_admin'] },
]

const roleColors = {
  admin: 'bg-blue-100 text-blue-700',
  coach: 'bg-green-100 text-green-700',
  parent: 'bg-yellow-100 text-yellow-700',
  player: 'bg-purple-100 text-purple-700',
  super_admin: 'bg-red-100 text-red-700',
}

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const { signOut, profile } = useAuthStore()
  const navigate = useNavigate()

  const navItems = allNavItems.filter(item => item.roles.includes(profile?.role))
  const displayName = getDisplayName(profile, i18n.language)
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
  <button
    onClick={() => window.location.reload()}
    className="flex items-center justify-center w-full"
  >
    <img
      src="/Logo.png"
      alt="Fariki"
      className="h-18 w-auto object-contain mix-blend-multiply"
    />
  </button>
</div>

      {/* User profile */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">{initials || '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[profile?.role] || 'bg-gray-100 text-gray-600'}`}>
              {profile?.role ? t(`roles.${profile.role}`) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-green-50 text-green-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
        >
          <span>🚪</span>
          <span>{t('auth.logout')}</span>
        </button>
      </div>
    </aside>
  )
}