import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeams } from '../../hooks/useTeams'
import { supabase } from '../../lib/supabase'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

const defaultTitles = {
  training: 'Entraînement',
  match: 'Match',
  other: 'Autre événement',
}

export default function EventForm({ onClose, onCreated }) {
  const { t } = useTranslation()
  const { teams } = useTeams()

  const [form, setForm] = useState({
    team_id: '',
    type: 'training',
    title: 'Entraînement',
    start_at: '',
    location: '',
    notes: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleTypeChange = (type) => {
    setForm((prev) => {
      const currentDefaultTitle = defaultTitles[prev.type]

      const shouldUpdateTitle =
        !prev.title.trim() ||
        prev.title === currentDefaultTitle

      return {
        ...prev,
        type,
        title: shouldUpdateTitle
          ? defaultTitles[type]
          : prev.title,
      }
    })
  }

  const handleSubmit = async () => {
    if (
      !form.team_id ||
      !form.title.trim() ||
      !form.start_at
    ) {
      setError('Veuillez remplir les champs obligatoires.')
      return
    }

    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
    }

    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select('*, teams(name)')
      .single()

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    onCreated?.(data)
    onClose?.()
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        px-4
      "
      style={{
        background: 'rgba(13, 27, 62, 0.6)',
      }}
    >
      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-lg
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            px-6
            py-4
            border-b
            flex
            items-center
            justify-between
          "
          style={{
            borderColor: 'hsl(214, 32%, 91%)',
            background: 'hsl(210, 40%, 98%)',
          }}
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
            "
            style={{ color: MARINE }}
          >
            Nouvel événement
          </p>

          <button
            onClick={onClose}
            className="
              text-slate-400
              hover:text-slate-600
              text-lg
              leading-none
            "
            type="button"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <p className="text-red-500 text-xs bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Type
            </label>

            <select
              value={form.type}
              onChange={(e) =>
                handleTypeChange(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{
                borderColor: 'hsl(214, 32%, 91%)',
              }}
            >
              <option value="training">
                Entraînement
              </option>

              <option value="match">
                Match
              </option>

              <option value="other">
                Autre
              </option>
            </select>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Titre *
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: 'hsl(214, 32%, 91%)',
              }}
              placeholder="ex: Entraînement U12"
            />
          </div>

          {/* Équipe */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Équipe *
            </label>

            <select
              value={form.team_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  team_id: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{
                borderColor: 'hsl(214, 32%, 91%)',
              }}
            >
              <option value="">
                Sélectionner...
              </option>

              {teams.map((team) => (
                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date + lieu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Date et heure *
              </label>

              <input
                type="datetime-local"
                value={form.start_at}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_at: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  borderColor:
                    'hsl(214, 32%, 91%)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Lieu
              </label>

              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  borderColor:
                    'hsl(214, 32%, 91%)',
                }}
                placeholder="Terrain principal"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              style={{
                borderColor: 'hsl(214, 32%, 91%)',
              }}
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            px-6
            py-4
            border-t
            flex
            justify-end
            gap-2
          "
          style={{
            borderColor: 'hsl(214, 32%, 91%)',
            background: 'hsl(210, 40%, 98%)',
          }}
        >
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
          >
            {t('common.cancel')}
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold rounded-lg disabled:opacity-50 transition"
            style={{
              background: EMERALD,
              color: MARINE,
            }}
          >
            {saving
              ? 'Enregistrement...'
              : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}