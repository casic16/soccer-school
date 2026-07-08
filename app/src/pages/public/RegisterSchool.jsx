import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterSchool() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    school_name: '',
    city: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!form.school_name || !form.admin_name || !form.admin_email || !form.admin_password) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (form.admin_password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    setSaving(true)
    setError(null)

    const response = await fetch(
      'https://wjfrniomfdtkiqohhlez.supabase.co/functions/v1/create-school',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      }
    )

    const data = await response.json()

    if (data?.error) {
      setError(data.error)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">École créée avec succès !</h2>
        <p className="text-gray-500 mb-6">
          Votre compte admin a été créé. Connectez-vous pour commencer.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
        >
          Se connecter
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
    <img src="/Logo.png" alt="Fariki" className="h-24 w-auto object-contain"
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