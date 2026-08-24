import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [invitation, setInvitation] = useState(null)
  const [form, setForm] = useState({ full_name: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError(`Lien d'invitation invalide.`)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (error || !data) {
        setError('Invitation invalide ou expirée.')
      } else {
        setInvitation(data)
      }
      setLoading(false)
    }

    fetchInvitation()
  }, [token])

  const handleRegister = async () => {
    if (!form.full_name || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    setSaving(true)
    setError(null)

   const response = await fetch(
  'https://wjfrniomfdtkiqohhlez.supabase.co/functions/v1/complete-registration',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      token,
      full_name: form.full_name,
      password: form.password,
    }),
  }
)

const data = await response.json()

if (data?.error) {
  setError(data.error)
  setSaving(false)
  return
}

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: invitation.email,
      password: form.password,
    })

    if (loginError) {
      setError(loginError.message)
      setSaving(false)
      return
    }

    navigate('/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Vérification de l'invitation...</p>
    </div>
  )

  if (error && !invitation) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => navigate('/login')} className="mt-4 text-sm text-green-600 hover:underline">
          Retour au login
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
      <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase text-center mb-2">
        Créer votre compte
      </p>
      <p className="text-white/30 text-sm text-center mb-8">
        Invitation pour <span className="text-red-400">{invitation?.email}</span>
        {' '}— <span className="capitalize">{invitation?.role}</span>
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">Nom complet</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="Prénom Nom"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">Mot de passe</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="Minimum 6 caractères"
          />
        </div>
        <button
          onClick={handleRegister}
          disabled={saving}
          className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 mt-4"
          style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 8px 20px rgba(220,38,38,0.4)' }}
        >
          {saving ? 'Création...' : 'Créer mon compte'}
        </button>
      </div>
    </div>
  </div>
</div>
  )
}