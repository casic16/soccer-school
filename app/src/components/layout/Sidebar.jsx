import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'
import Avatar from '../ui/Avatar'

const allNavItems = [
  {
    section: 'Vue d\'ensemble',
    items: [
      { path: '/dashboard', label: 'Tableau de bord', icon: '⊞', roles: ['admin', 'coach', 'parent', 'player', 'super_admin'] },
      { path: '/stats', label: 'Statistiques', icon: '◈', roles: ['admin', 'coach'] },
    ]
  },
  {
    section: 'Gestion',
    items: [
      { path: '/teams', label: 'Équipes', icon: '◎', roles: ['admin', 'coach'] },
      { path: '/events', label: 'Événements', icon: '◷', roles: ['admin', 'coach', 'parent', 'player'] },
      { path: '/players', label: 'Joueurs', icon: '◉', roles: ['admin', 'coach'] },
      { path: '/availability', label: 'Présences', icon: '◈', roles: ['admin', 'coach', 'parent', 'player'], badge: true },
    ]
  },
  {
    section: 'Administration',
    items: [
      { path: '/invitations', label: 'Invitations', icon: '◻', roles: ['admin'] },
      { path: '/users', label: 'Utilisateurs', icon: '◎', roles: ['admin'] },
      { path: '/notifications', label: 'Notifications', icon: '◷', roles: ['admin', 'coach', 'parent', 'player'], badge: true },
      { path: '/super-admin', label: 'Super Admin', icon: '◈', roles: ['super_admin'] },
    ]
  },
]

const roleColors = {
  admin: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  coach: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  parent: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  player: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  super_admin: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const { signOut, profile } = useAuthStore()
  const navigate = useNavigate()

  const displayName = getDisplayName(profile, i18n.language)
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const visibleSections = allNavItems.map(section => ({
    ...section,
    items: section.items.filter(item => item.roles.includes(profile?.role))
  })).filter(section => section.items.length > 0)

  return (
    <aside className="w-56 flex flex-col flex-shrink-0 border-r border-white/5"
      style={{ background: 'hsl(222, 47%, 11%)' }}>

      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 group w-full"
        >
          <img src="/Logo.png" alt="Fariki" className="h-8 w-auto object-contain mix-blend-multiply" 
            style={{ filter: 'brightness(0) invert(1)' }} />
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
          onClick={() => navigate('/profile')}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(222, 47%, 11%)' }}>
            {initials || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleColors[profile?.role] || 'text-gray-400'}`}>
              {profile?.role ? t(`roles.${profile.role}`) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
        {visibleSections.map((section) => (
          <div key={section.section}>
            <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.15em] px-2 mb-1">
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`text-sm ${isActive ? 'text-emerald-400' : ''}`}>{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-3 border-t border-white/5">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <span>⊠</span>
          <span>{t('auth.logout')}</span>
        </button>
      </div>
    </aside>
  )
}