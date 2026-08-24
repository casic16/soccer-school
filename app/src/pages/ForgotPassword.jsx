import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #0a0f1e 100%)' }}
    >
      <div className="text-center">
        <div className="text-6xl mb-6">📧</div>
        <h2 className="text-2xl font-bold text-white mb-2">Email envoyé !</h2>
        <p className="text-white/50 mb-8">Vérifiez votre boîte email pour réinitialiser votre mot de passe.</p>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          ← Retour au login
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #0a0f1e 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.15) 0%, transparent 60%)' }}
      />

      <div className="mb-8 relative z-10">
        <img src="/fariki-logo.png" alt="Fariki" className="h-24 w-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 20px rgba(220,38,38,0.4))' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl p-8 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
        >
          <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase text-center mb-8">
            Réinitialiser le mot de passe
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="vous@exemple.com"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 8px 20px rgba(220,38,38,0.4)' }}
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full text-center text-sm text-white/40 hover:text-white/60 transition"
            >
              ← Retour au login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}