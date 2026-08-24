import { useTranslation } from 'react-i18next'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { useAuthStore } from '../stores/authStore'
import { getRoleTheme } from '../theme/roleTheme'

import {
  Trophy,
  Dumbbell,
  Check,
  HelpCircle,
  X,
  UserRound,
  Clock3,
  ClipboardCheck,
} from 'lucide-react'

const MARINE = '#0d1b3e'

export default function Availability() {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const theme = getRoleTheme(profile?.role)

  const {
    availabilities,
    loading,
    updateStatus,
  } = useAvailabilities()

  return (
    <div className="space-y-5">

      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.12em]
            "
            style={{ color: theme.accent }}
          >
            Présences à confirmer
          </p>

          <p className="text-sm text-slate-500 mt-1">
            {availabilities.length} réponse
            {availabilities.length > 1 ? 's' : ''} en attente
          </p>
        </div>

        <div
          className="
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
          "
          style={{
            background: theme.accentSoft,
            color: theme.accent,
          }}
        >
          <ClipboardCheck size={21} strokeWidth={1.8} />
        </div>
      </div>

      {loading ? (
        <ListSkeleton rows={5} />
      ) : availabilities.length === 0 ? (
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            min-h-[360px]
            flex
            items-center
            justify-center
          "
        >
          <EmptyState
            icon="✅"
            title="Tout est à jour !"
            description="Aucune présence en attente de confirmation."
          />
        </div>
      ) : (
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            overflow-hidden
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* Header */}
              <thead className="bg-slate-50/70">
                <tr>
                  {[
                    'Événement',
                    'Joueur',
                    'Date',
                    'Action',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="
                        text-left
                        px-5
                        py-3
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-slate-400
                      "
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-slate-100">
                {availabilities.map((availability) => {
                  const isMatch =
                    availability.events?.type === 'match'

                  const EventIcon =
                    isMatch
                      ? Trophy
                      : Dumbbell

                  const playerInitial =
                    availability.players?.full_name?.[0]?.toUpperCase() || '?'

                  return (
                    <tr
                      key={availability.id}
                      className="
                        hover:bg-slate-50/70
                        transition-colors
                      "
                    >

                      {/* Event */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                            "
                            style={{
                              background:
                                isMatch
                                  ? 'rgba(59,130,246,0.08)'
                                  : theme.accentSoft,
                              color:
                                isMatch
                                  ? '#3b82f6'
                                  : theme.accent,
                            }}
                          >
                            <EventIcon
                              size={18}
                              strokeWidth={1.8}
                            />
                          </div>

                          <div>
                            <p
                              className="
                                text-[13px]
                                font-semibold
                              "
                              style={{
                                color: MARINE,
                              }}
                            >
                              {availability.events?.title || 'Événement'}
                            </p>

                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {isMatch
                                ? 'Match'
                                : 'Entraînement'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Player */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-9
                              h-9
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              font-bold
                              text-xs
                            "
                            style={{
                              background: theme.accentSoft,
                              color: theme.accent,
                            }}
                          >
                            {playerInitial}
                          </div>

                          <div>
                            <p
                              className="
                                text-[12px]
                                font-semibold
                              "
                              style={{
                                color: MARINE,
                              }}
                            >
                              {availability.players?.full_name || 'Joueur'}
                            </p>

                            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400">
                              <UserRound size={11} />
                              Joueur
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        {availability.events?.start_at ? (
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock3 size={14} />

                            <span className="text-[12px]">
                              {format(
                                new Date(
                                  availability.events.start_at
                                ),
                                'dd MMM à HH:mm',
                                { locale: fr }
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* Present */}
                          <button
                            onClick={() =>
                              updateStatus(
                                availability.id,
                                'confirmed'
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1.5
                              rounded-lg
                              text-[11px]
                              font-semibold
                              bg-emerald-50
                              text-emerald-700
                              hover:bg-emerald-100
                              transition
                            "
                          >
                            <Check size={13} />
                            Présent
                          </button>

                          {/* Maybe */}
                          <button
                            onClick={() =>
                              updateStatus(
                                availability.id,
                                'maybe'
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1.5
                              rounded-lg
                              text-[11px]
                              font-semibold
                              bg-amber-50
                              text-amber-700
                              hover:bg-amber-100
                              transition
                            "
                          >
                            <HelpCircle size={13} />
                            Peut-être
                          </button>

                          {/* Absent */}
                          <button
                            onClick={() =>
                              updateStatus(
                                availability.id,
                                'absent'
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1.5
                              rounded-lg
                              text-[11px]
                              font-semibold
                              bg-red-50
                              text-red-700
                              hover:bg-red-100
                              transition
                            "
                          >
                            <X size={13} />
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}