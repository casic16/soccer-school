import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useSchools = () => {
  const { profile } = useAuthStore()
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || profile.role !== 'super_admin') return

    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*, users(count)')
        .order('created_at', { ascending: false })
      if (error) console.error('Schools fetch error:', error)
      else setSchools(data || [])
      setLoading(false)
    }

    fetchSchools()
  }, [profile])

  return { schools, loading }
}