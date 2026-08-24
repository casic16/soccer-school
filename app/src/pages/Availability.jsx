import { useMemo, useState } from 'react'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { useAuthStore } from '../stores/authStore'
import { getRoleTheme } from '../theme/roleTheme'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

import {
  Trophy,
  Dumbbell,
  Check,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  UsersRound,
  Clock3,
  ClipboardCheck,
} from 'lucide-react'

const MARINE = '#0d1b3e'

export default function Availability() {
  const { profile } = useAuthStore()
  const theme = getRoleTheme(profile?.role)

  const {
    availabilities,
    loading,
    updateStatus,
  } = useAvailabilities()

  const [openEvents, setOpenEvents] = useState({})

  const groupedAvailabilities = useMemo(() => {
    const groups = {}

    availabilities.forEach((availability) => {
      const event = availability.events

      const key =
        event?.id ||
        `${event?.title || 'event'}-${event?.start_at || ''}`

      if (!groups[key]) {
        groups[key] = {
          event,
          items: [],
        }
      }

      groups[key].items.push(availability)
    })

    return Object.entries(groups)
      .map(([id, group]) => ({
        id,
        ...group,
      }))
      .sort((a, b) => {
        const dateA = a.event?.start_at
          ? new Date(a.event.start_at)
          : new Date(0)

        const dateB = b.event?.start_at
          ? new Date(b.event.start_at)
          : new Date(0)

        return dateA - dateB
      })
  }, [availabilities])

  const toggleEvent = (eventId) => {
    setOpenEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }))
  }

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
            {' · '}
            {groupedAvailabilities.length} événement
            {groupedAvailabilities.length > 1 ? 's' : ''}
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

      {/* Content */}
      {loading ? (
        <ListSkeleton rows={5} />
      ) : groupedAvailabilities.length === 0 ? (
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
        <div className="space-y-4">
          {groupedAvailabilities.map((group) => {
            const event = group.event
            const isOpen = openEvents[group.id] ?? true
            const isMatch = event?.type === 'match'
            const EventIcon = isMatch ? Trophy : Dumbbell

            return (
              <section
                key={group.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-slate-100
                  shadow-sm
                  overflow-hidden
                "
              >
                {/* Event header */}
                <button
                  type="button"
                  onClick={() => toggleEvent(group.id)}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-4
                    px-5
                    py-4
                    text-left
                    hover:bg-slate-50/60
                    transition
                  "
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                      style={{
                        background: isMatch
                          ? 'rgba(59,130,246,0.08)'
                          : theme.accentSoft,
                        color: isMatch
                          ? '#3b82f6'
                          : theme.accent,
                      }}
                    >
                      <EventIcon
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="
                            text-[14px]
                            font-semibold
                            truncate
                          "
                          style={{ color: MARINE }}
                        >
                          {event?.title || 'Événement'}
                        </h3>

                        <span
                          className="
                            inline-flex
                            items-center
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                          "
                          style={{
                            background: isMatch
                              ? 'rgba(59,130,246,0.08)'
                              : theme.accentSoft,
                            color: isMatch
                              ? '#3b82f6'
                              : theme.accent,
                          }}
                        >
                          {isMatch ? 'Match' : 'Entraînement'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-400 flex-wrap">
                        {event?.start_at && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={12} />
                            {format(
                              new Date(event.start_at),
                              'dd MMM à HH:mm',
                              { locale: fr }
                            )}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5">
                          <UsersRound size={12} />
                          {group.items.length} joueur
                          {group.items.length > 1 ? 's' : ''} en attente
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[28px]
                        h-7
                        px-2
                        rounded-full
                        text-[11px]
                        font-bold
                      "
                      style={{
                        background: theme.accentSoft,
                        color: theme.accent,
                      }}
                    >
                      {group.items.length}
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={17}
                        className="text-slate-400"
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="text-slate-400"
                      />
                    )}
                  </div>
                </button>

                {/* Players */}
                {isOpen && (
                  <div className="border-t border-slate-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50/70">
                          <tr>
                            <th
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
                              Joueur
                            </th>

                            <th
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
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {group.items.map((availability) => {
                            const playerName =
                              availability.players?.full_name ||
                              'Joueur'

                            const playerInitial =
                              playerName?.[0]?.toUpperCase() || '?'

                            return (
                              <tr
                                key={availability.id}
                                className="
                                  hover:bg-slate-50/60
                                  transition
                                "
                              >
                                {/* Player */}
                                <td className="px-5 py-3.5">
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
                                        background:
                                          theme.accentSoft,
                                        color:
                                          theme.accent,
                                      }}
                                    >
                                      {playerInitial}
                                    </div>

                                    <span
                                      className="
                                        text-[12px]
                                        font-semibold
                                      "
                                      style={{
                                        color: MARINE,
                                      }}
                                    >
                                      {playerName}
                                    </span>
                                  </div>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-2 flex-wrap">
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
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}