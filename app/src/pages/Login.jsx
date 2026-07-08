import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
]

export default function Login() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { persistSession: remember },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #0a0f1e 100%)',
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Logo */}
      <div className="mb-8 relative z-10">
        <img
          src="/Logo.png"
          alt="Fariki"
          className="h-28 w-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 20px rgba(220,38,38,0.4))' }}
        />
      </div>

      {/* Language selector */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-200 ${
                i18n.language === lang.code
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl p-8 backdrop-blur-md"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Title */}
          <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase text-center mb-8">
            Se connecter à Fariki
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-white/50">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 mt-4"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 8px 20px rgba(220,38,38,0.4)',
              }}
            >
              {loading ? t('auth.connecting') : '✓ Connexion'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-white/20 text-xs tracking-widest relative z-10">
        FARIKI © {new Date().getFullYear()}
      </p>
    </div>
  )
}