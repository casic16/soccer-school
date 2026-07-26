import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import NotificationBell from '../notifications/NotificationBell'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

const pageTitles = {
  '/dashboard': 'Tableau de bord',
  '/teams': 'Équipes',
  '/events': 'Événements',
  '/players': 'Joueurs',
  '/availability': 'Présences',
  '/stats': 'Statistiques',
  '/invitations': 'Invitations',
  '/users': 'Utilisateurs',
  '/notifications': 'Notifications',
  '/profile': 'Mon profil',
  '/super-admin': 'Super Admin',
}

export default function AppLayout() {
  const { profile } = useAuthStore()
  const { i18n } = useTranslation()
  const { init } = useNotificationStore()
  const location = useLocation()

  useEffect(() => {
    if (profile?.id) init(profile.id)
  }, [profile?.id])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'Fariki'

  return (
    <div className="flex min-h-screen" style={{ background: 'hsl(210, 40%, 98%)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b px-6 py-2.5 flex justify-between items-center sticky top-0 z-30"
          style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
          <h1 className="font-heading font-bold text-base" style={{ color: 'hsl(222, 47%, 11%)' }}>
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 bg-slate-50 p-0.5 rounded-lg border border-slate-100">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all duration-150 ${
                    i18n.language === lang.code
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}