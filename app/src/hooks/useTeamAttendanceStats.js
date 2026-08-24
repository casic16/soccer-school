import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useTeamAttendanceStats = () => {
  const { profile } = useAuthStore()

  const [teamStats, setTeamStats] = useState({})
  const [globalStats, setGlobalStats] = useState({
    confirmed: 0,
    absent: 0,
    maybe: 0,
    pending: 0,
    responded: 0,
    total: 0,
    attendanceRate: null,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.school_id) {
      setTeamStats({})
      setGlobalStats({
        confirmed: 0,
        absent: 0,
        maybe: 0,
        pending: 0,
        responded: 0,
        total: 0,
        attendanceRate: null,
      })
      setLoading(false)
      return
    }

    const fetchAttendanceStats = async () => {
      setLoading(true)

      try {
        /*
         * 1. Récupérer les équipes accessibles
         */
        let teamsQuery = supabase
          .from('teams')
          .select('id')
          .eq('school_id', profile.school_id)

        if (profile.role === 'coach') {
          teamsQuery = teamsQuery.eq('coach_id', profile.id)
        }

        const { data: teams, error: teamsError } =
          await teamsQuery

        if (teamsError) {
          console.error(
            'Attendance stats teams error:',
            teamsError
          )
          return
        }

        const teamIds =
          teams?.map((team) => team.id) || []

        if (teamIds.length === 0) {
          setTeamStats({})
          setGlobalStats({
            confirmed: 0,
            absent: 0,
            maybe: 0,
            pending: 0,
            responded: 0,
            total: 0,
            attendanceRate: null,
          })
          return
        }

        /*
         * 2. Récupérer les joueurs appartenant
         *    à ces équipes
         */
        const {
          data: players,
          error: playersError,
        } = await supabase
          .from('players')
          .select('id, team_id')
          .in('team_id', teamIds)

        if (playersError) {
          console.error(
            'Attendance stats players error:',
            playersError
          )
          return
        }

        const playerIds =
          players?.map((player) => player.id) || []

        if (playerIds.length === 0) {
          setTeamStats({})
          setGlobalStats({
            confirmed: 0,
            absent: 0,
            maybe: 0,
            pending: 0,
            responded: 0,
            total: 0,
            attendanceRate: null,
          })
          return
        }

        /*
         * Correspondance player_id -> team_id
         */
        const playerTeamMap = {}

        players.forEach((player) => {
          playerTeamMap[player.id] = player.team_id
        })

        /*
         * 3. Récupérer toutes les disponibilités
         *
         * IMPORTANT :
         * pas de filtre "pending" ici,
         * car nous avons besoin de tous les statuts.
         */
        const {
          data: availabilities,
          error: availabilitiesError,
        } = await supabase
          .from('availabilities')
          .select('player_id, status')
          .in('player_id', playerIds)

        if (availabilitiesError) {
          console.error(
            'Attendance stats availabilities error:',
            availabilitiesError
          )
          return
        }

        /*
         * 4. Initialiser les statistiques
         *    de chaque équipe
         */
        const stats = {}

        teamIds.forEach((teamId) => {
          stats[teamId] = {
            confirmed: 0,
            absent: 0,
            maybe: 0,
            pending: 0,
            responded: 0,
            total: 0,
            attendanceRate: null,
          }
        })

        /*
         * 5. Compter les différents statuts
         */
        ;(availabilities || []).forEach(
          (availability) => {
            const teamId =
              playerTeamMap[availability.player_id]

            if (!teamId || !stats[teamId]) {
              return
            }

            stats[teamId].total += 1

            switch (availability.status) {
              case 'confirmed':
                stats[teamId].confirmed += 1
                break

              case 'absent':
                stats[teamId].absent += 1
                break

              case 'maybe':
                stats[teamId].maybe += 1
                break

              case 'pending':
                stats[teamId].pending += 1
                break

              default:
                break
            }
          }
        )

        /*
         * 6. Calcul du taux par équipe
         *
         * Les pending ne sont pas inclus
         * dans le dénominateur.
         */
        Object.keys(stats).forEach((teamId) => {
          const team = stats[teamId]

          team.responded =
            team.confirmed +
            team.absent +
            team.maybe

          team.attendanceRate =
            team.responded > 0
              ? Math.round(
                  (team.confirmed /
                    team.responded) *
                    100
                )
              : null
        })

        /*
         * 7. Statistiques globales
         */
        const global = Object.values(stats).reduce(
          (acc, team) => {
            acc.confirmed += team.confirmed
            acc.absent += team.absent
            acc.maybe += team.maybe
            acc.pending += team.pending
            acc.responded += team.responded
            acc.total += team.total

            return acc
          },
          {
            confirmed: 0,
            absent: 0,
            maybe: 0,
            pending: 0,
            responded: 0,
            total: 0,
            attendanceRate: null,
          }
        )

        global.attendanceRate =
          global.responded > 0
            ? Math.round(
                (global.confirmed /
                  global.responded) *
                  100
              )
            : null

        setTeamStats(stats)
        setGlobalStats(global)
      } catch (error) {
        console.error(
          'Attendance stats unexpected error:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceStats()
  }, [
    profile?.id,
    profile?.school_id,
    profile?.role,
  ])

  return {
    teamStats,
    globalStats,
    loading,
  }
}