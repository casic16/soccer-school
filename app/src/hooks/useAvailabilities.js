import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useAvailabilities = () => {
  const { profile } = useAuthStore()

  const [availabilities, setAvailabilities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchAvailabilities = async () => {
      setLoading(true)

      let query = supabase
        .from('availabilities')
        .select(
          `
          *,
          events(
            id,
            title,
            start_at,
            type
          ),
          players(
            full_name,
            user_id
          )
        `
        )
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)

      if (
        profile.role === 'parent' ||
        profile.role === 'player'
      ) {
        /*
         * Parent / joueur :
         * voit uniquement les présences
         * de ses enfants / lui-même
         */
        const {
          data: playerIds,
          error: playersError,
        } = await supabase
          .from('players')
          .select('id')
          .eq('user_id', profile.id)

        if (playersError) {
          console.error(
            'Players fetch error:',
            playersError
          )

          setAvailabilities([])
          setLoading(false)
          return
        }

        const ids =
          playerIds?.map((player) => player.id) || []

        if (ids.length === 0) {
          setAvailabilities([])
          setLoading(false)
          return
        }

        query = query.in('player_id', ids)
      } else if (profile.role === 'coach') {
        /*
         * Coach :
         * voit uniquement les présences
         * des joueurs de ses équipes
         */
        const {
          data: coachTeams,
          error: teamsError,
        } = await supabase
          .from('teams')
          .select('id')
          .eq('school_id', profile.school_id)
          .eq('coach_id', profile.id)

        if (teamsError) {
          console.error(
            'Coach teams fetch error:',
            teamsError
          )

          setAvailabilities([])
          setLoading(false)
          return
        }

        const teamIds =
          coachTeams?.map((team) => team.id) || []

        if (teamIds.length === 0) {
          setAvailabilities([])
          setLoading(false)
          return
        }

        const {
          data: playerIds,
          error: playersError,
        } = await supabase
          .from('players')
          .select('id')
          .in('team_id', teamIds)

        if (playersError) {
          console.error(
            'Coach players fetch error:',
            playersError
          )

          setAvailabilities([])
          setLoading(false)
          return
        }

        const ids =
          playerIds?.map((player) => player.id) || []

        if (ids.length === 0) {
          setAvailabilities([])
          setLoading(false)
          return
        }

        query = query.in('player_id', ids)
      }

      /*
       * Admin :
       * pas de filtre supplémentaire.
       */

      const {
        data,
        error,
      } = await query

      if (error) {
        console.error(
          'Availabilities fetch error:',
          error
        )

        setAvailabilities([])
      } else {
        setAvailabilities(data || [])
      }

      setLoading(false)
    }

    fetchAvailabilities()
  }, [
    profile?.id,
    profile?.role,
    profile?.school_id,
  ])

  const updateStatus = async (
    id,
    status
  ) => {
    const { error } = await supabase
      .from('availabilities')
      .update({
        status,
        responded_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error(
        'Availability update error:',
        error
      )

      return {
        error,
      }
    }

    /*
     * Comme l'écran n'affiche que les pending,
     * on retire immédiatement la ligne après réponse.
     */
    setAvailabilities((prev) =>
      prev.filter(
        (availability) =>
          availability.id !== id
      )
    )

    return {
      error: null,
    }
  }

  return {
    availabilities,
    loading,
    updateStatus,
  }
}