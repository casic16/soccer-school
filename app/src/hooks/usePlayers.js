import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const usePlayers = (teamId = null) => {
  const { profile } = useAuthStore()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchPlayers = async () => {
      let query = supabase
        .from('players')
        .select('*, teams(name, age_group)')

      if (teamId) {
        query = query.eq('team_id', teamId)
      } else {
        query = query.in(
          'team_id',
          (await supabase
            .from('teams')
            .select('id')
            .eq('school_id', profile.school_id)
          ).data?.map((t) => t.id) || []
        )
      }

      const { data, error } = await query.order('full_name', { ascending: true })
      if (error) console.error('Players fetch error:', error)
      else setPlayers(data || [])
      setLoading(false)
    }

    fetchPlayers()
  }, [profile, teamId])

  const addPlayer = async (player) => {
  const { data: { session } } = await supabase.auth.getSession()
  const { data, error } = await supabase
    .from('players')
    .insert({ ...player, user_id: session.user.id })
    .select('*, teams(name, age_group)')
    .single()
  if (!error) setPlayers((prev) => [...prev, data])
  return { data, error }
}

  const deletePlayer = async (id) => {
    const { error } = await supabase.from('players').delete().eq('id', id)
    if (!error) setPlayers((prev) => prev.filter((p) => p.id !== id))
    return { error }
  }

  return { players, loading, addPlayer, deletePlayer }
}