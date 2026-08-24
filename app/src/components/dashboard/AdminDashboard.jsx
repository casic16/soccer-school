import { useTeams } from '../../hooks/useTeams'
import { useEvents } from '../../hooks/useEvents'
import { useTeamAttendanceStats } from '../../hooks/useTeamAttendanceStats'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'
import { useAuthStore } from '../../stores/authStore'
import { getRoleTheme } from '../../theme/roleTheme'

import {
  UsersRound,
  CalendarDays,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  Trophy,
  Dumbbell,
} from 'lucide-react'

const MARINE = '#0d1b3e'

export default function AdminDashboard() {
  const { profile } = useAuthStore()
  const theme = getRoleTheme(profile?.role)

  const {
    teams,
    loading: teamsLoading,
  } = useTeams()

  const {
    events,
    loading: eventsLoading,
  } = useEvents()

  const {
    teamStats,
    globalStats,
    loading: statsLoading,
  } = useTeamAttendanceStats()

  const navigate = useNavigate()

  const totalPlayers = teams.reduce(
    (acc, team) =>
      acc + (team.players?.[0]?.count || 0),
    0
  )

  const kpis = [
    {
      label: 'Équipes',
      value: teams.length,
      sub: `${totalPlayers} joueurs`,
      icon: UsersRound,
      route: '/teams',
    },
    {
      label: 'Événements',
      value: events.length,
      sub: 'à venir',
      icon: CalendarDays,
      route: '/events',
    },
    {
      label: 'Présences att.',
      value: statsLoading
        ? '—'
        : globalStats.pending,
      sub: 'en attente',
      icon: ClipboardCheck,
      route: '/availability',
    },
    {
      label: 'Taux présence',
      value: statsLoading
        ? '—'
        : globalStats.attendanceRate !== null
        ? `${globalStats.attendanceRate}%`
        : '—',
      sub: 'global',
      icon: TrendingUp,
      route: '/stats',
    },
  ]

  return (
    <div className="space-y-6">

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon

          return (
            <button
              key={kpi.label}
              onClick={() =>
                navigate(kpi.route)
              }
              className="
                relative
                overflow-hidden
                bg-white
                rounded-2xl
                border
                border-slate-100
                p-5
                text-left
                shadow-sm
                hover:shadow-md
                hover:-translate-y-0.5
                transition-all
                duration-200
                group
              "
            >
              <div
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                "
                style={{
                  background: theme.accent,
                }}
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                    "
                  >
                    {kpi.label}
                  </p>

                  <p
                    className="
                      font-heading
                      font-extrabold
                      text-[32px]
                      leading-none
                      mt-3
                    "
                    style={{
                      color: MARINE,
                    }}
                  >
                    {kpi.value}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {kpi.sub}
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
                    flex-shrink-0
                  "
                  style={{
                    background:
                      theme.accentSoft,
                    color:
                      theme.accent,
                  }}
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-1
                  mt-4
                  text-[11px]
                  font-semibold
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                "
                style={{
                  color: theme.accent,
                }}
              >
                Voir les détails
                <ArrowRight size={13} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Prochains événements */}
        <section
          className="
            xl:col-span-2
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            overflow-hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-slate-100
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                "
                style={{
                  color: MARINE,
                }}
              >
                Prochains événements
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Matchs et entraînements à venir
              </p>
            </div>

            <button
              onClick={() =>
                navigate('/events')
              }
              className="
                flex
                items-center
                gap-1
                text-[11px]
                font-semibold
                text-slate-400
                hover:text-slate-600
                transition
              "
            >
              Voir tout
              <ArrowRight size={13} />
            </button>
          </div>

          {eventsLoading ? (
            <ListSkeleton rows={5} />
          ) : events.length === 0 ? (
            <EmptyState
              icon="📅"
              title="Aucun événement"
              description="Aucun événement n'est actuellement planifié."
              action={
                <button
                  onClick={() =>
                    navigate('/events')
                  }
                  className="
                    text-xs
                    font-semibold
                    px-3
                    py-2
                    rounded-lg
                  "
                  style={{
                    background:
                      theme.accent,
                    color: '#ffffff',
                  }}
                >
                  + Créer un événement
                </button>
              }
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {events
                .slice(0, 6)
                .map((event) => {
                  const isMatch =
                    event.type === 'match'

                  const EventIcon =
                    isMatch
                      ? Trophy
                      : Dumbbell

                  return (
                    <button
                      key={event.id}
                      onClick={() =>
                        navigate('/events')
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-5
                        py-3.5
                        text-left
                        hover:bg-slate-50/70
                        transition-colors
                      "
                    >
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

                      <div className="flex-1 min-w-0">
                        <p
                          className="
                            text-[13px]
                            font-semibold
                            truncate
                          "
                          style={{
                            color: MARINE,
                          }}
                        >
                          {event.title}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-slate-400
                            truncate
                            mt-0.5
                          "
                        >
                          {event.teams?.name ||
                            'Équipe non définie'}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className="
                            text-[12px]
                            font-semibold
                          "
                          style={{
                            color: MARINE,
                          }}
                        >
                          {format(
                            new Date(
                              event.start_at
                            ),
                            'dd MMM',
                            {
                              locale: fr,
                            }
                          )}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {format(
                            new Date(
                              event.start_at
                            ),
                            'HH:mm'
                          )}
                        </p>
                      </div>
                    </button>
                  )
                })}
            </div>
          )}
        </section>

        {/* Équipes */}
        <section
          className="
            xl:col-span-3
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            overflow-hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-slate-100
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                "
                style={{
                  color: MARINE,
                }}
              >
                Équipes
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Aperçu des équipes du club
              </p>
            </div>

            <button
              onClick={() =>
                navigate('/teams')
              }
              className="
                flex
                items-center
                gap-1
                text-[11px]
                font-semibold
                text-slate-400
                hover:text-slate-600
                transition
              "
            >
              Gérer
              <ArrowRight size={13} />
            </button>
          </div>

          {teamsLoading ||
          statsLoading ? (
            <ListSkeleton rows={5} />
          ) : teams.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Aucune équipe"
              description="Créez votre première équipe pour commencer."
              action={
                <button
                  onClick={() =>
                    navigate('/teams')
                  }
                  className="
                    text-xs
                    font-semibold
                    px-3
                    py-2
                    rounded-lg
                  "
                  style={{
                    background:
                      theme.accent,
                    color: '#ffffff',
                  }}
                >
                  + Créer une équipe
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50/70">
                  <tr>
                    {[
                      'Équipe',
                      'Catégorie',
                      'Joueurs',
                      'Présence',
                      'Statut',
                    ].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="
                            text-left
                            px-5
                            py-3
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            text-[10px]
                            text-slate-400
                          "
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {teams.map(
                    (team) => {
                      const playerCount =
                        team.players?.[0]
                          ?.count || 0

                      const stats =
                        teamStats[
                          team.id
                        ] || {
                          confirmed: 0,
                          absent: 0,
                          maybe: 0,
                          pending: 0,
                          responded: 0,
                          attendanceRate:
                            null,
                        }

                      const rate =
                        stats.attendanceRate

                      const hasRate =
                        rate !== null

                      const isGood =
                        hasRate &&
                        rate >= 75

                      return (
                        <tr
                          key={team.id}
                          onClick={() =>
                            navigate(
                              `/teams/${team.id}`
                            )
                          }
                          className="
                            hover:bg-slate-50/70
                            transition-colors
                            cursor-pointer
                          "
                        >
                          {/* Équipe */}
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
                                "
                                style={{
                                  background:
                                    theme.accentSoft,

                                  color:
                                    theme.accent,
                                }}
                              >
                                <UsersRound
                                  size={17}
                                  strokeWidth={
                                    1.8
                                  }
                                />
                              </div>

                              <span
                                className="
                                  font-semibold
                                  text-[12px]
                                "
                                style={{
                                  color:
                                    MARINE,
                                }}
                              >
                                {team.name}
                              </span>
                            </div>
                          </td>

                          {/* Catégorie */}
                          <td className="px-5 py-3.5 text-slate-400">
                            {team.age_group ||
                              '—'}
                          </td>

                          {/* Joueurs */}
                          <td
                            className="
                              px-5
                              py-3.5
                              font-semibold
                            "
                            style={{
                              color:
                                MARINE,
                            }}
                          >
                            {playerCount}
                          </td>

                          {/* Présence */}
                          <td className="px-5 py-3.5">
                            {hasRate ? (
                              <div className="flex items-center gap-3 min-w-[120px]">
                                <div
                                  className="
                                    flex-1
                                    h-1.5
                                    rounded-full
                                    bg-slate-100
                                    overflow-hidden
                                  "
                                >
                                  <div
                                    className="
                                      h-full
                                      rounded-full
                                      transition-all
                                    "
                                    style={{
                                      width: `${rate}%`,

                                      background:
                                        isGood
                                          ? '#22c55e'
                                          : '#f59e0b',
                                    }}
                                  />
                                </div>

                                <span
                                  className="
                                    font-bold
                                    text-[11px]
                                    w-8
                                    text-right
                                  "
                                  style={{
                                    color:
                                      isGood
                                        ? '#16a34a'
                                        : '#b45309',
                                  }}
                                >
                                  {rate}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          {/* Statut */}
                          <td className="px-5 py-3.5">
                            {!hasRate ? (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  px-2.5
                                  py-1
                                  rounded-full
                                  text-[10px]
                                  font-bold
                                  bg-slate-100
                                  text-slate-500
                                "
                              >
                                Aucune donnée
                              </span>
                            ) : (
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
                                style={
                                  isGood
                                    ? {
                                        background:
                                          '#dcfce7',
                                        color:
                                          '#15803d',
                                      }
                                    : {
                                        background:
                                          '#fff7ed',
                                        color:
                                          '#b45309',
                                      }
                                }
                              >
                                {isGood
                                  ? 'Actif'
                                  : 'Attention'}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}