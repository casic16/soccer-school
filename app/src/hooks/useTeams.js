import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useTeams = () => {
  const { profile } = useAuthStore()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchTeams = async () => {
      let query = supabase
        .from('teams')
        .select('*, players(count)')
        .eq('school_id', profile.school_id)

      // Coach voit uniquement ses équipes
      if (profile.role === 'coach') {
        query = query.eq('coach_id', profile.id)
      }

      const { data, error } = await query.order('name')
      if (error) console.error('Teams fetch error:', error)
      else setTeams(data || [])
      setLoading(false)
    }

    fetchTeams()
  }, [profile])

  return { teams, loading, setTeams }
}