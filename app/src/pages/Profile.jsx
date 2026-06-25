import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { useProfile } from '../hooks/useProfile'
import Avatar from '../components/ui/Avatar'

const positions = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant']
const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]

export default function Profile() {
  const { profile } = useAuthStore()
  const { t, i18n } = useTranslation()
  const { updateProfile, uploadAvatar, changePassword, saving, uploading, error, success } = useProfile()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    preferred_language: profile?.preferred_language || 'fr',
    date_of_birth: profile?.date_of_birth || '',
    position: profile?.position || '',
    jersey_number: profile?.jersey_number || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    new_password: '',
    confirm_password: '',
  })
  const [passwordError, setPasswordError] = useState(null)

  const handleSave = async () => {
    const updates = { ...form }
    if (form.preferred_language !== i18n.language) {
      i18n.changeLanguage(form.preferred_language)
      document.documentElement.dir = form.preferred_language === 'ar' ? 'rtl' : 'ltr'
    }
    await updateProfile(updates)
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadAvatar(file)
  }

  const handleChangePassword = async () => {
    setPasswordError(null)
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Les mots de passe ne correspondent pas.')
      return
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError('Minimum 6 caractères.')
      return
    }
    await changePassword(passwordForm.new_password)
    setPasswordForm({ new_password: '', confirm_password: '' })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
        <p className="text-sm text-gray-400 mt-1">Gérez vos informations personnelles</p>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-xl">✓ Profil mis à jour avec succès</p>}

      {/* Avatar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-semibold text-gray-700 mb-4">Photo de profil</h3>
        <div className="flex items-center gap-4">
          <Avatar url={profile?.avatar_url} name={profile?.full_name} size="xl" onClick={handleAvatarClick} />
          <div>
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              {uploading ? 'Envoi...' : 'Changer la photo'}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 2MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-semibold text-gray-700 mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langue préférée</label>
            <select
              value={form.preferred_language}
              onChange={(e) => setForm({ ...form, preferred_language: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Informations joueur */}
      {(profile?.role === 'player' || profile?.role === 'parent') && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-semibold text-gray-700 mb-4">
            {profile?.role === 'player' ? 'Informations sportives' : 'Informations enfant'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {profile?.role === 'player' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner...</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de maillot</label>
                  <input
                    type="text"
                    value={form.jersey_number}
                    onChange={(e) => setForm({ ...form, jersey_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ex: 10"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact urgence — Nom</label>
              <input
                type="text"
                value={form.emergency_contact_name}
                onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact urgence — Téléphone</label>
              <input
                type="tel"
                value={form.emergency_contact_phone}
                onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bouton sauvegarder */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition disabled:opacity-50 font-medium"
        >
          {saving ? 'Enregistrement...' : '✓ Enregistrer'}
        </button>
      </div>

      {/* Changer mot de passe */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Changer le mot de passe</h3>
        {passwordError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-3 rounded-xl">{passwordError}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
            <input
              type="password"
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Répéter le mot de passe"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleChangePassword}
            disabled={saving || !passwordForm.new_password}
            className="px-6 py-2.5 bg-gray-800 text-white text-sm rounded-xl hover:bg-gray-900 transition disabled:opacity-50 font-medium"
          >
            {saving ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </div>
      </div>
    </div>
  )
}