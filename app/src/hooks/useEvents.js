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
      const { data, error } = await supabase
        .from('events')
        .select('*, teams(name)')
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(5)

      if (error) console.error('Events fetch error:', error)
      else setEvents(data || [])
      setLoading(false)
    }

    fetchEvents()
  }, [profile])

  return { events, loading }
}