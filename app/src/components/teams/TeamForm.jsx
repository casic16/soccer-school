import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'

export default function TeamForm({ onClose, onCreated }) {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const [form, setForm] = useState({
    name: '',
    age_group: '',
    season: '2024-2025',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Le nom est obligatoire.')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...form,
        school_id: profile.school_id,
        coach_id: profile.id,
      })
      .select('*, players(count)')
      .single()
    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      onCreated?.(data)
      onClose?.()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Nouvelle équipe</h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ex: Les Aigles"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie d'âge</label>
            <select
              value={form.age_group}
              onChange={(e) => setForm({ ...form, age_group: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sélectionner...</option>
              {['U6','U8','U10','U12','U14','U16','U18','Senior'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saison</label>
            <input
              type="text"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ex: 2024-2025"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}