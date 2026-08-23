import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import NotificationBell from '../notifications/NotificationBell'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'

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
    subtitle: 'Suivez les disponibilités de vos joueurs',
  },
  '/stats': {
    title: 'Statistiques',
    subtitle: 'Analysez les performances de votre club',
  },
  '/invitations': {
    title: 'Invitations',
    subtitle: 'Invitez les membres de votre organisation',
  },
  '/users': {
    title: 'Utilisateurs',
    subtitle: 'Gérez les accès et les rôles',
  },
  '/notifications': {
    title: 'Notifications',
    subtitle: 'Centre de notifications Fariki',
  },
  '/profile': {
    title: 'Mon profil',
    subtitle: 'Vos informations personnelles',
  },
  '/super-admin': {
    title: 'Super Admin',
    subtitle: 'Administration de la plateforme',
  },
}

export default function AppLayout() {
  const { profile } = useAuthStore()
  const { i18n } = useTranslation()
  const { init } = useNotificationStore()
  const location = useLocation()

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
        background: 'hsl(210, 40%, 98%)',
      }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="
            h-[72px]
            bg-white/95
            backdrop-blur
            border-b
            px-8
            flex
            items-center
            justify-between
            sticky
            top-0
            z-30
          "
          style={{
            borderColor: 'hsl(214, 32%, 91%)',
          }}
        >
          <div>
            <h1
              className="
                font-heading
                font-bold
                text-[17px]
                leading-tight
              "
              style={{
                color: 'hsl(222, 47%, 11%)',
              }}
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
                items-center
                gap-1
                bg-slate-50
                p-1
                rounded-xl
                border
                border-slate-100
              "
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    changeLanguage(lang.code)
                  }
                  className={`
                    min-w-[34px]
                    px-2
                    py-1.5
                    text-[11px]
                    rounded-lg
                    font-semibold
                    transition-all
                    ${
                      i18n.language === lang.code
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }
                  `}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="h-7 w-px bg-slate-100" />

            <NotificationBell />
          </div>
        </header>

        {/* Main content */}
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