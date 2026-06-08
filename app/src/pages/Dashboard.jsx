import { useAuthStore, getDisplayName } from '../stores/authStore'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()
  const { t, i18n } = useTranslation()

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-green-600">{t('app.name')}</h1>
        <div className="flex items-center gap-4">
          {/* Sélecteur de langue */}
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
            {getDisplayName(profile, i18n.language) || 'Utilisateur'}
          </span>
          <button
            onClick={signOut}
            className="text-sm text-red-500 hover:text-red-700"
          >
            {t('auth.logout')}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('dashboard.hello')} {getDisplayName(profile, i18n.language)} 👋
        </h2>
        <p className="text-gray-500 mb-8">
          {t('dashboard.role')} :{' '}
          <span className="font-medium capitalize">
            {profile?.role ? t(`roles.${profile.role}`) : ''}
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('dashboard.teams')}</p>
            <p className="text-3xl font-bold text-green-600 mt-1">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('dashboard.upcoming_events')}</p>
            <p className="text-3xl font-bold text-green-600 mt-1">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('dashboard.pending_availabilities')}</p>
            <p className="text-3xl font-bold text-green-600 mt-1">—</p>
          </div>
        </div>
      </main>
    </div>
  )
}