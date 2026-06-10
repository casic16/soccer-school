import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useInvitations = () => {
  const { profile } = useAuthStore()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchInvitations = async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('school_id', profile.school_id)
        .order('created_at', { ascending: false })
      if (error) console.error('Invitations fetch error:', error)
      else setInvitations(data || [])
      setLoading(false)
    }

    fetchInvitations()
  }, [profile])

  const createInvitation = async (email, role) => {
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        email,
        role,
        school_id: profile.school_id,
        invited_by: profile.id,
      })
      .select()
      .single()
    if (!error) setInvitations((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteInvitation = async (id) => {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id)
    if (!error) setInvitations((prev) => prev.filter((i) => i.id !== id))
    return { error }
  }

  return { invitations, loading, createInvitation, deleteInvitation }
}