import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

export default function TeamForm({ onClose, onCreated }) {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const [form, setForm] = useState({ name: '', age_group: '', season: '2025-2026' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!form.name) { setError('Le nom est obligatoire.'); return }
    setSaving(true)
    const { data, error } = await supabase
      .from('teams')
      .insert({ ...form, school_id: profile.school_id, coach_id: profile.id })
      .select('*, players(count)')
      .single()
    if (error) { setError(error.message); setSaving(false) }
    else { onCreated?.(data); onClose?.() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(13, 27, 62, 0.6)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'hsl(214, 32%, 91%)', background: 'hsl(210, 40%, 98%)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: MARINE }}>Nouvelle équipe</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
        </div>

        <div className="p-6 space-y-4">
          {error && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-lg">{error}</p>}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'hsl(214, 32%, 91%)' }}
              placeholder="ex: Les Aigles"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Catégorie d'âge</label>
              <select
                value={form.age_group}
                onChange={(e) => setForm({ ...form, age_group: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'hsl(214, 32%, 91%)' }}
              >
                <option value="">Sélectionner...</option>
                {['U6','U8','U10','U12','U14','U16','U18','Senior'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Saison</label>
              <input
                type="text"
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'hsl(214, 32%, 91%)' }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'hsl(214, 32%, 91%)', background: 'hsl(210, 40%, 98%)' }}>
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold rounded-lg disabled:opacity-50 transition"
            style={{ background: EMERALD, color: MARINE }}
          >
            {saving ? 'Enregistrement...' : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}