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
        setError('Lien d\'invitation invalide.')
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

  const { data, error } = await supabase.functions.invoke('complete-registration', {
    body: {
      token,
      full_name: form.full_name,
      password: form.password,
    },
  })

  if (error || data?.error) {
    setError(data?.error || error.message)
    setSaving(false)
    return
  }

  // Connecter automatiquement après inscription
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

    // 1. Créer le compte Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setSaving(false)
      return
    }

    // 2. Créer le profil utilisateur
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        school_id: invitation.school_id,
        full_name: form.full_name,
        email: invitation.email,
        role: invitation.role,
      })

    if (profileError) {
      setError(profileError.message)
      setSaving(false)
      return
    }

    // 3. Marquer l'invitation comme acceptée
    await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Créer votre compte</h1>
        <p className="text-gray-500 mb-6">
          Invitation pour <span className="font-medium text-green-600">{invitation?.email}</span>
          {' '}— Rôle : <span className="font-medium capitalize">{invitation?.role}</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Prénom Nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <button
            onClick={handleRegister}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Création...' : 'Créer mon compte'}
          </button>
        </div>
      </div>
    </div>
  )
}