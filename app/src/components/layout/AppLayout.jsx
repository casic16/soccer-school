import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTranslation } from 'react-i18next'
import { useAuthStore, getDisplayName } from '../../stores/authStore'

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function AppLayout() {
  const { profile } = useAuthStore()
  const { i18n } = useTranslation()

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center">
          <div />
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2 py-1 text-xs rounded font-medium transition ${
                    i18n.language === lang.code
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {getDisplayName(profile, i18n.language)}
            </span>
          </div>
        </header>
        <main className="flex-1 px-6 py-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}clearInterval