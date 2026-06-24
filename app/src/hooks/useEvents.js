import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useEvents = () => {
  const { profile } = useAuthStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchEvents = async () => {
      let teamIds = []

      if (profile.role === 'coach') {
        // Coach voit uniquement les événements de ses équipes
        const { data: coachTeams } = await supabase
          .from('teams')
          .select('id')
          .eq('school_id', profile.school_id)
          .eq('coach_id', profile.id)
        teamIds = coachTeams?.map(t => t.id) || []

      } else if (profile.role === 'parent' || profile.role === 'player') {
        // Parent/joueur voit uniquement les événements des équipes de ses enfants/lui-même
        const { data: playerTeams } = await supabase
          .from('players')
          .select('team_id')
          .eq('user_id', profile.id)
        teamIds = playerTeams?.map(p => p.team_id) || []

      } else {
        // Admin voit tous les événements de l'école
        const { data: schoolTeams } = await supabase
          .from('teams')
          .select('id')
          .eq('school_id', profile.school_id)
        teamIds = schoolTeams?.map(t => t.id) || []
      }

      if (teamIds.length === 0) {
        setEvents([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('events')
        .select('*, teams(name)')
        .in('team_id', teamIds)
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(10)

      if (error) console.error('Events fetch error:', error)
      else setEvents(data || [])
      setLoading(false)
    }

    fetchEvents()
  }, [profile])

  return { events, loading, setEvents }
}