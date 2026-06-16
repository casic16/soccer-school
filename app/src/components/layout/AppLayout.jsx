import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import NotificationBell from '../notifications/NotificationBell'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function AppLayout() {
  const { profile } = useAuthStore()
  const { i18n } = useTranslation()
  const { init } = useNotificationStore()

  useEffect(() => {
    if (profile?.id) init(profile.id)
  }, [profile?.id])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — cachée sur mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm bg-white/90">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-base font-bold text-gray-900">Fariki</span>
          </div>
          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-150 ${
                    i18n.language === lang.code
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Main content — padding bottom sur mobile pour la nav */}
        <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-6xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Navigation mobile bottom */}
      <MobileNav />
    </div>
  )
}