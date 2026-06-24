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
      let query = supabase
        .from('availabilities')
        .select('*, events(title, start_at, type), players(full_name, user_id)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)

      if (profile.role === 'parent' || profile.role === 'player') {
        // Parent/joueur voit uniquement les présences de ses enfants/lui-même
        const { data: playerIds } = await supabase
          .from('players')
          .select('id')
          .eq('user_id', profile.id)
        
        const ids = playerIds?.map(p => p.id) || []
        if (ids.length === 0) {
          setAvailabilities([])
          setLoading(false)
          return
        }
        query = query.in('player_id', ids)

      } else if (profile.role === 'coach') {
        // Coach voit les présences de ses équipes uniquement
        const { data: coachTeams } = await supabase
          .from('teams')
          .select('id')
          .eq('school_id', profile.school_id)
          .eq('coach_id', profile.id)
        
        const teamIds = coachTeams?.map(t => t.id) || []
        if (teamIds.length === 0) {
          setAvailabilities([])
          setLoading(false)
          return
        }

        const { data: playerIds } = await supabase
          .from('players')
          .select('id')
          .in('team_id', teamIds)
        
        const ids = playerIds?.map(p => p.id) || []
        if (ids.length === 0) {
          setAvailabilities([])
          setLoading(false)
          return
        }
        query = query.in('player_id', ids)
      }
      // Admin voit tout — pas de filtre supplémentaire

      const { data, error } = await query
      if (error) console.error('Availabilities fetch error:', error)
      else setAvailabilities(data || [])
      setLoading(false)
    }

    fetchAvailabilities()
  }, [profile])

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('availabilities')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setAvailabilities((prev) => prev.filter((a) => a.id !== id))
    }
  }

  return { availabilities, loading, updateStatus }
}