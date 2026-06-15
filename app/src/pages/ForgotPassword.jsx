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
    if (!email) {
      setError('Veuillez entrer votre email.')
      return
    }
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
        <p className="text-gray-500 mb-6">
          Vérifiez votre boîte email et cliquez sur le lien pour réinitialiser votre mot de passe.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-green-600 hover:underline"
        >
          Retour au login
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe oublié</h1>
        <p className="text-gray-500 mb-6">
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="vous@exemple.com"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Retour au login
          </button>
        </div>
      </div>
    </div>
  )
}