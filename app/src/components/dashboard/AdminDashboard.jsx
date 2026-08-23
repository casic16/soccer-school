import { useTeams } from '../../hooks/useTeams'
import { useEvents } from '../../hooks/useEvents'
import { useAvailabilities } from '../../hooks/useAvailabilities'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ListSkeleton } from '../ui/Skeleton'

const MARINE = 'hsl(222, 47%, 11%)'
const EMERALD = 'hsl(142, 71%, 45%)'

export default function AdminDashboard() {
  const {
    teams,
    loading: teamsLoading,
  } = useTeams()

  const {
    events,
    loading: eventsLoading,
  } = useEvents()

  const {
    availabilities,
  } = useAvailabilities()

  const navigate = useNavigate()

  const totalPlayers = teams.reduce(
    (acc, team) =>
      acc + (team.players?.[0]?.count || 0),
    0
  )

  const confirmedCount =
    availabilities.filter(
      (availability) =>
        availability.status === 'confirmed'
    ).length

  const globalAttendance =
    totalPlayers > 0
      ? Math.round(
          (confirmedCount /
            Math.max(totalPlayers, 1)) *
            100
        )
      : null

  const kpis = [
    {
      label: 'Équipes',
      value: teams.length,
      sub: `${totalPlayers} joueurs`,
      route: '/teams',
      accent: EMERALD,
      icon: 'EQ',
    },
    {
      label: 'Événements',
      value: events.length,
      sub: 'à venir',
      route: '/events',
      accent: '#3b82f6',
      icon: 'EV',
    },
    {
      label: 'Présences à confirmer',
      value: availabilities.length,
      sub: 'en attente',
      route: '/availability',
      accent: '#f59e0b',
      icon: 'PR',
    },
    {
      label: 'Taux de présence',
      value:
        globalAttendance !== null
          ? `${globalAttendance}%`
          : '—',
      sub: 'global',
      route: '/stats',
      accent: EMERALD,
      icon: '%',
    },
  ]

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => navigate(kpi.route)}
            className="
              group
              relative
              overflow-hidden
              bg-white
              rounded-2xl
              border
              border-slate-100
              p-5
              text-left
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            <div
              className="
                absolute
                top-0
                left-0
                right-0
                h-[3px]
              "
              style={{
                background: kpi.accent,
              }}
            />

            <div className="flex items-start justify-between">
              <div>
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-400
                  "
                >
                  {kpi.label}
                </p>

                <p
                  className="
                    mt-3
                    text-[34px]
                    leading-none
                    font-heading
                    font-extrabold
                    tracking-tight
                  "
                  style={{
                    color: MARINE,
                  }}
                >
                  {kpi.value}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {kpi.sub}
                </p>
              </div>

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-[11px]
                  font-extrabold
                "
                style={{
                  color: kpi.accent,
                  background: `${kpi.accent}12`,
                }}
              >
                {kpi.icon}
              </div>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                gap-1
                text-xs
                font-semibold
                opacity-0
                translate-y-1
                group-hover:opacity-100
                group-hover:translate-y-0
                transition-all
              "
              style={{
                color: kpi.accent,
              }}
            >
              Voir les détails
              <span>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main widgets */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-12
          gap-5
        "
      >
        {/* Upcoming events */}
        <section
          className="
            xl:col-span-5
            bg-white
            rounded-2xl
            border
            border-slate-100
            overflow-hidden
          "
        >
          <div
            className="
              h-[60px]
              px-5
              flex
              items-center
              justify-between
              border-b
              border-slate-100
            "
          >
            <div>
              <h3
                className="
                  text-sm
                  font-heading
                  font-bold
                "
                style={{
                  color: MARINE,
                }}
              >
                Prochains événements
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Matchs et entraînements à venir
              </p>
            </div>

            <button
              onClick={() =>
                navigate('/events')
              }
              className="
                text-xs
                font-semibold
                text-slate-400
                hover:text-emerald-600
                transition
              "
            >
              Voir tout →
            </button>
          </div>

          {eventsLoading ? (
            <ListSkeleton rows={4} />
          ) : events.length === 0 ? (
            <div
              className="
                min-h-[310px]
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-6
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >
                <span className="text-2xl">
                  ◷
                </span>
              </div>

              <h4
                className="
                  font-heading
                  font-semibold
                  text-base
                "
                style={{
                  color: MARINE,
                }}
              >
                Aucun événement à venir
              </h4>

              <p
                className="
                  mt-1.5
                  text-xs
                  text-slate-400
                  max-w-[260px]
                "
              >
                Planifiez votre prochain match ou
                entraînement.
              </p>

              <button
                onClick={() =>
                  navigate('/events')
                }
                className="
                  mt-5
                  px-4
                  py-2
                  rounded-xl
                  text-xs
                  font-semibold
                  transition
                  hover:shadow-md
                "
                style={{
                  background: EMERALD,
                  color: MARINE,
                }}
              >
                + Créer un événement
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {events
                .slice(0, 6)
                .map((event) => (
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
                      hover:bg-slate-50
                      transition
                    "
                  >
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        text-sm
                        font-bold
                        ${
                          event.type === 'match'
                            ? 'bg-blue-50 text-blue-500'
                            : 'bg-emerald-50 text-emerald-600'
                        }
                      `}
                    >
                      {event.type ===
                      'match'
                        ? 'M'
                        : 'E'}
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
                          'Toutes les équipes'}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className="
                          text-xs
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

                      <p
                        className="
                          text-[11px]
                          text-slate-400
                          mt-0.5
                        "
                      >
                        {format(
                          new Date(
                            event.start_at
                          ),
                          'HH:mm'
                        )}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>

        {/* Teams */}
        <section
          className="
            xl:col-span-7
            bg-white
            rounded-2xl
            border
            border-slate-100
            overflow-hidden
          "
        >
          <div
            className="
              h-[60px]
              px-5
              flex
              items-center
              justify-between
              border-b
              border-slate-100
            "
          >
            <div>
              <h3
                className="
                  text-sm
                  font-heading
                  font-bold
                "
                style={{
                  color: MARINE,
                }}
              >
                Vos équipes
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Aperçu des effectifs et présences
              </p>
            </div>

            <button
              onClick={() =>
                navigate('/teams')
              }
              className="
                text-xs
                font-semibold
                text-slate-400
                hover:text-emerald-600
                transition
              "
            >
              Gérer →
            </button>
          </div>

          {teamsLoading ? (
            <ListSkeleton rows={5} />
          ) : teams.length === 0 ? (
            <div
              className="
                min-h-[310px]
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                  mb-4
                  text-xl
                "
              >
                ◎
              </div>

              <p
                className="
                  font-heading
                  font-semibold
                "
                style={{
                  color: MARINE,
                }}
              >
                Aucune équipe
              </p>

              <button
                onClick={() =>
                  navigate('/teams')
                }
                className="
                  mt-4
                  px-4
                  py-2
                  rounded-xl
                  text-xs
                  font-semibold
                "
                style={{
                  background: EMERALD,
                  color: MARINE,
                }}
              >
                + Créer une équipe
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    {[
                      'Équipe',
                      'Catégorie',
                      'Joueurs',
                      'Présence',
                      'Statut',
                    ].map((header) => (
                      <th
                        key={header}
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
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {teams.map((team) => {
                    const playerCount =
                      team.players?.[0]
                        ?.count || 0

                    /*
                     * TEMPORAIRE :
                     * À remplacer ensuite par le vrai
                     * taux de présence Supabase.
                     */
                    const rate = Math.round(
                      Math.random() * 40 +
                        60
                    )

                    const isGood =
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
                          cursor-pointer
                          hover:bg-slate-50/70
                          transition
                        "
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                w-9
                                h-9
                                rounded-xl
                                bg-emerald-50
                                flex
                                items-center
                                justify-center
                                text-emerald-600
                                font-bold
                              "
                            >
                              F
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
                                {team.name}
                              </p>

                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Saison 2026
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-slate-400">
                          {team.age_group}
                        </td>

                        <td
                          className="
                            px-5
                            py-3.5
                            font-semibold
                          "
                          style={{
                            color: MARINE,
                          }}
                        >
                          {playerCount}
                        </td>

                        <td className="px-5 py-3.5 min-w-[150px]">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex-1
                                h-[5px]
                                rounded-full
                                bg-slate-100
                                overflow-hidden
                              "
                            >
                              <div
                                className="
                                  h-full
                                  rounded-full
                                "
                                style={{
                                  width: `${rate}%`,
                                  background:
                                    isGood
                                      ? EMERALD
                                      : '#f59e0b',
                                }}
                              />
                            </div>

                            <span
                              className="
                                w-8
                                text-right
                                text-[11px]
                                font-bold
                              "
                              style={{
                                color: isGood
                                  ? 'hsl(142, 71%, 35%)'
                                  : '#b45309',
                              }}
                            >
                              {rate}%
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`
                              inline-flex
                              px-2.5
                              py-1
                              rounded-lg
                              text-[10px]
                              font-bold
                              ${
                                isGood
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }
                            `}
                          >
                            {isGood
                              ? 'Actif'
                              : 'Attention'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}