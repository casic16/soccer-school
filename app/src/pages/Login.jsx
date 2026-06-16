import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function Login() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      
      {/* Logo au dessus du carré */}
      <div className="mb-6">
        <img
          src="/Logo.png"
          alt="Fariki"
          className="h-40 w-auto object-contain mix-blend-multiply"
        />
      </div>

      {/* Carré blanc */}
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        
        {/* Language switcher */}
        <div className="flex justify-end gap-1 mb-6">
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
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-1">Bienvenue 👋</h1>
        <p className="text-gray-400 text-sm mb-6">{t('auth.login')}</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="vous@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {loading ? t('auth.connecting') : t('auth.login')}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-gray-400 hover:text-green-600 transition"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </div>
  )
}