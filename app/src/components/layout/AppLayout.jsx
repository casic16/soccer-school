import { Outlet } from 'react-router-dom'
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
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm bg-white/90">
          <div />
          <div className="flex items-center gap-3">
            {/* Language switcher */}
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

        {/* Main content */}
        <main className="flex-1 px-6 py-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}