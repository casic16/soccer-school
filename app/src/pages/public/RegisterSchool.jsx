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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-1">Fariki</h1>
          <p className="text-gray-500">Créez votre école de soccer en quelques minutes</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h3 className="font-bold text-gray-700 mb-3">Informations de l'école</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'école *</label>
                <input
                  type="text"
                  value={form.school_name}
                  onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ex: École de Soccer Montréal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ex: Montréal"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-3">Compte administrateur</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  value={form.admin_name}
                  onChange={(e) => setForm({ ...form, admin_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Prénom Nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.admin_email}
                  onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="admin@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <input
                  type="password"
                  value={form.admin_password}
                  onChange={(e) => setForm({ ...form, admin_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Minimum 6 caractères"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 mt-2"
          >
            {saving ? 'Création en cours...' : 'Créer mon école'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ?{' '}
            <button onClick={() => navigate('/login')} className="text-green-600 hover:underline">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}