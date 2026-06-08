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
      const { data, error } = await supabase
        .from('availabilities')
        .select('*, events(title, start_at, type), players(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)

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