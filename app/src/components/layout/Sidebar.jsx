import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'
import { getRoleTheme } from '../../theme/roleTheme'

import {
  LayoutDashboard,
  BarChart3,
  UsersRound,
  CalendarDays,
  UserRound,
  Diamond,
  Mail,
  Users,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react'

const allNavItems = [
  {
    section: "Vue d'ensemble",
    items: [
      {
        path: '/dashboard',
        label: 'Tableau de bord',
        icon: LayoutDashboard,
        roles: ['admin', 'coach', 'parent', 'player', 'super_admin'],
      },
      {
        path: '/stats',
        label: 'Statistiques',
        icon: BarChart3,
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
        icon: UsersRound,
        roles: ['admin', 'coach'],
      },
      {
        path: '/events',
        label: 'Événements',
        icon: CalendarDays,
        roles: ['admin', 'coach', 'parent', 'player'],
      },
      {
        path: '/players',
        label: 'Joueurs',
        icon: UserRound,
        roles: ['admin', 'coach'],
      },
      {
        path: '/availability',
        label: 'Présences',
        icon: Diamond,
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
        icon: Mail,
        roles: ['admin'],
      },
      {
        path: '/users',
        label: 'Utilisateurs',
        icon: Users,
        roles: ['admin'],
      },
      {
        path: '/notifications',
        label: 'Notifications',
        icon: Bell,
        roles: ['admin', 'coach', 'parent', 'player'],
        badge: true,
      },
      {
        path: '/super-admin',
        label: 'Super Admin',
        icon: ShieldCheck,
        roles: ['super_admin'],
      },
    ],
  },
]

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const { signOut, profile } = useAuthStore()
  const navigate = useNavigate()

  const theme = getRoleTheme(profile?.role)

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
        w-[252px]
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
          'linear-gradient(180deg, #0d1b3e 0%, #081328 100%)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 w-full text-left"
        >
          <div
            className="
              w-[54px]
              h-[54px]
              rounded-2xl
              bg-white
              overflow-hidden
              flex
              items-center
              justify-center
              shadow-md
            "
          >
            <img
              src="/Logo.png"
              alt="Fariki"
              className="
                w-[145px]
                max-w-none
                object-contain
                translate-x-[40px]
              "
            />
          </div>

          <div>
            <p
              className="
                font-heading
                font-extrabold
                text-[24px]
                leading-none
              "
              style={{ color: '#ef3038' }}
            >
              Fariki
            </p>

            <p className="text-[11px] text-white/40 mt-1">
              Club Management
            </p>
          </div>
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-3">
        <button
          onClick={() => navigate('/profile')}
          className="
            w-full
            flex
            items-center
            gap-3
            p-2
            rounded-xl
            hover:bg-white/[0.05]
            transition
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
              font-bold
              text-sm
            "
            style={{
              background: '#22c55e',
              color: '#0d1b3e',
            }}
          >
            {initials || '?'}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-semibold text-white truncate">
              {displayName}
            </p>

            <span
              className="
                inline-block
                text-[10px]
                font-semibold
                px-2
                py-0.5
                rounded-md
                mt-1
              "
              style={{
                color: theme.accent,
                background: theme.accentSoft,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              {profile?.role
                ? t(`roles.${profile.role}`)
                : ''}
            </span>
          </div>

          <ChevronRight
            size={15}
            className="text-white/30"
          />
        </button>
      </div>

      <div className="mx-4 h-px bg-white/[0.07]" />

      {/* Navigation */}
      <nav
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
          space-y-6
        "
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor:
            'rgba(255,255,255,0.08) transparent',
        }}
      >
        {visibleSections.map((section) => (
          <div key={section.section}>
            <p
              className="
                px-2
                mb-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.13em]
              "
              style={{ color: theme.accent }}
            >
              {section.section}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `
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
                        ${
                          isActive
                            ? 'text-white'
                            : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                        }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <>
                            <span
                              className="
                                absolute
                                inset-0
                                rounded-xl
                              "
                              style={{
                                background:
                                  theme.accentSoft,
                              }}
                            />

                            <span
                              className="
                                absolute
                                left-0
                                top-2
                                bottom-2
                                w-[3px]
                                rounded-full
                              "
                              style={{
                                background:
                                  theme.accent,
                              }}
                            />
                          </>
                        )}

                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          className="relative z-10"
                          style={{
                            color: isActive
                              ? theme.accent
                              : undefined,
                          }}
                        />

                        <span className="relative z-10 flex-1">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span
                            className="
                              relative
                              z-10
                              w-2
                              h-2
                              rounded-full
                            "
                            style={{
                              background:
                                theme.accent,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/[0.07]">
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
            text-white/60
            hover:text-red-400
            hover:bg-red-500/10
            transition
          "
        >
          <LogOut size={18} />

          <span>
            {t('auth.logout')}
          </span>
        </button>
      </div>
    </aside>
  )
}