import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import NotificationBell from '../notifications/NotificationBell'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { getRoleTheme } from '../../theme/roleTheme'
import { UserRound } from 'lucide-react'

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

const pageTitles = {
  '/dashboard': {
    title: 'Tableau de bord',
    subtitle: "Vue d'ensemble de votre club",
  },

  '/teams': {
    title: 'Équipes',
    subtitle: 'Gérez les équipes de votre club',
  },

  '/events': {
    title: 'Événements',
    subtitle: 'Matchs, entraînements et activités',
  },

  '/players': {
    title: 'Joueurs',
    subtitle: 'Effectif et informations des joueurs',
  },

  '/availability': {
    title: 'Présences',
    subtitle: 'Suivez les disponibilités',
  },

  '/stats': {
    title: 'Statistiques',
    subtitle: 'Analysez votre organisation',
  },

  '/invitations': {
    title: 'Invitations',
    subtitle: 'Invitez de nouveaux membres',
  },

  '/users': {
    title: 'Utilisateurs',
    subtitle: 'Gérez les accès et les rôles',
  },

  '/notifications': {
    title: 'Notifications',
    subtitle: 'Centre de notifications',
  },

  '/profile': {
    title: 'Mon profil',
    subtitle: 'Informations personnelles',
  },

  '/super-admin': {
    title: 'Super Admin',
    subtitle: 'Administration Fariki',
  },
}

export default function AppLayout() {
  const { profile } = useAuthStore()
  const { i18n } = useTranslation()
  const { init } = useNotificationStore()
  const location = useLocation()
  const navigate = useNavigate()

  const theme = getRoleTheme(profile?.role)

  useEffect(() => {
    if (profile?.id) {
      init(profile.id)
    }
  }, [profile?.id])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)

    document.documentElement.dir =
      code === 'ar' ? 'rtl' : 'ltr'

    document.documentElement.lang = code
  }

  const currentPage =
    Object.entries(pageTitles).find(([path]) =>
      location.pathname.startsWith(path)
    )?.[1] || {
      title: 'Fariki',
      subtitle: '',
    }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: '#f8fafc',
        '--role-accent': theme.accent,
      }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header
          className="
            h-[76px]
            bg-white
            border-b
            border-slate-100
            px-8
            flex
            items-center
            justify-between
            sticky
            top-0
            z-30
          "
        >
          <div>
            <h1
              className="
                font-heading
                font-bold
                text-lg
              "
              style={{ color: '#0d1b3e' }}
            >
              {currentPage.title}
            </h1>

            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentPage.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* Languages */}
            <div
              className="
                flex
                bg-slate-50
                border
                border-slate-100
                rounded-xl
                p-1
              "
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`
                    min-w-[36px]
                    px-2
                    py-1.5
                    rounded-lg
                    text-[11px]
                    font-semibold
                    transition
                    ${
                      i18n.language === lang.code
                        ? 'bg-white shadow-sm'
                        : 'text-slate-400'
                    }
                  `}
                  style={{
                    color:
                      i18n.language === lang.code
                        ? theme.accent
                        : undefined,
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-slate-100" />

            <NotificationBell />

            {/* Profil */}
            <button
              onClick={() => navigate('/profile')}
              title="Mon profil"
              aria-label="Ouvrir mon profil"
              className="
                w-9
                h-9
                rounded-full
                bg-slate-50
                border
                border-slate-100
                flex
                items-center
                justify-center
                transition-all
                hover:bg-white
                hover:shadow-sm
                hover:border-slate-200
              "
            >
              <UserRound
                size={20}
                color="#0d1b3e"
              />
            </button>
          </div>
        </header>

        {/* Content */}
        <main
          className="
            flex-1
            w-full
            max-w-[1600px]
            mx-auto
            px-8
            py-7
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}