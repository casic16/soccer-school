import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'

const allNavItems = [
  {
    section: "Vue d'ensemble",
    items: [
      {
        path: '/dashboard',
        label: 'Tableau de bord',
        icon: '⌂',
        roles: ['admin', 'coach', 'parent', 'player', 'super_admin'],
      },
      {
        path: '/stats',
        label: 'Statistiques',
        icon: '◫',
        roles: ['admin', 'coach'],
      },
    ],
  },
  {
    section: 'Gestion',
    items: [
      {
        path: '/teams',
        label: 'Équipes',
        icon: '◎',
        roles: ['admin', 'coach'],
      },
      {
        path: '/events',
        label: 'Événements',
        icon: '◷',
        roles: ['admin', 'coach', 'parent', 'player'],
      },
      {
        path: '/players',
        label: 'Joueurs',
        icon: '○',
        roles: ['admin', 'coach'],
      },
      {
        path: '/availability',
        label: 'Présences',
        icon: '◇',
        roles: ['admin', 'coach', 'parent', 'player'],
        badge: true,
      },
    ],
  },
  {
    section: 'Administration',
    items: [
      {
        path: '/invitations',
        label: 'Invitations',
        icon: '□',
        roles: ['admin'],
      },
      {
        path: '/users',
        label: 'Utilisateurs',
        icon: '◉',
        roles: ['admin'],
      },
      {
        path: '/notifications',
        label: 'Notifications',
        icon: '◴',
        roles: ['admin', 'coach', 'parent', 'player'],
        badge: true,
      },
      {
        path: '/super-admin',
        label: 'Super Admin',
        icon: '◆',
        roles: ['super_admin'],
      },
    ],
  },
]

const roleColors = {
  admin:
    'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  coach:
    'text-blue-300 bg-blue-500/10 border-blue-500/20',
  parent:
    'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
  player:
    'text-purple-300 bg-purple-500/10 border-purple-500/20',
  super_admin:
    'text-red-300 bg-red-500/10 border-red-500/20',
}

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const { signOut, profile } = useAuthStore()
  const navigate = useNavigate()

  const displayName = getDisplayName(profile, i18n.language)

  const initials = displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const visibleSections = allNavItems
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.roles.includes(profile?.role)
      ),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <aside
      className="
        w-[264px]
        min-h-screen
        h-screen
        sticky
        top-0
        flex
        flex-col
        flex-shrink-0
        border-r
        border-white/5
      "
      style={{
        background:
          'linear-gradient(180deg, hsl(222, 47%, 11%) 0%, hsl(222, 47%, 9%) 100%)',
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="
            w-full
            h-[64px]
            bg-white
            rounded-2xl
            px-4
            py-2
            flex
            items-center
            justify-center
            shadow-sm
            transition
            hover:scale-[1.01]
          "
        >
          <img
            src="/Logo.png"
            alt="Fariki"
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* Profil */}
      <div className="px-3 pb-4">
        <button
          onClick={() => navigate('/profile')}
          className="
            w-full
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            text-left
            transition-all
            hover:bg-white/[0.05]
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              flex-shrink-0
              text-sm
              font-bold
            "
            style={{
              background: 'hsl(142, 71%, 45%)',
              color: 'hsl(222, 47%, 11%)',
            }}
          >
            {initials || '?'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {displayName}
            </p>

            <span
              className={`
                inline-flex
                items-center
                mt-1
                text-[10px]
                font-semibold
                px-2
                py-0.5
                rounded-md
                border
                ${
                  roleColors[profile?.role] ||
                  'text-gray-400 border-white/10'
                }
              `}
            >
              {profile?.role ? t(`roles.${profile.role}`) : ''}
            </span>
          </div>

          <span className="text-white/20 text-xs">›</span>
        </button>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {visibleSections.map((section) => (
          <div key={section.section}>
            <p
              className="
                px-3
                mb-2
                text-[10px]
                font-bold
                text-white/25
                uppercase
                tracking-[0.16em]
              "
            >
              {section.section}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      group
                      relative
                      flex
                      items-center
                      gap-3
                      min-h-[42px]
                      px-3
                      rounded-xl
                      text-[13px]
                      font-medium
                      transition-all
                      duration-150
                      ${
                        isActive
                          ? 'bg-white/[0.09] text-white'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            top-2
                            bottom-2
                            w-[3px]
                            rounded-full
                            bg-emerald-400
                          "
                        />
                      )}

                      <span
                        className={`
                          w-6
                          h-6
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-sm
                          transition
                          ${
                            isActive
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-white/35 group-hover:text-white/60'
                          }
                        `}
                      >
                        {item.icon}
                      </span>

                      <span className="flex-1">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={signOut}
          className="
            w-full
            flex
            items-center
            gap-3
            min-h-[42px]
            px-3
            rounded-xl
            text-[13px]
            font-medium
            text-white/40
            transition
            hover:bg-red-500/10
            hover:text-red-300
          "
        >
          <span
            className="
              w-6
              h-6
              flex
              items-center
              justify-center
            "
          >
            ↪
          </span>

          <span>{t('auth.logout')}</span>
        </button>
      </div>
    </aside>
  )
}