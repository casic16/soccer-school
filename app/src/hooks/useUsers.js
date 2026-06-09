import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useUsers = () => {
  const { profile } = useAuthStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || profile.role !== 'admin') return

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('school_id', profile.school_id)
        .order('full_name')
      if (error) console.error('Users fetch error:', error)
      else setUsers(data || [])
      setLoading(false)
    }

    fetchUsers()
  }, [profile])

  const updateRole = async (userId, role) => {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
    if (!error) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
    }
    return { error }
  }

  const deleteUser = async (userId) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    if (!error) setUsers((prev) => prev.filter((u) => u.id !== userId))
    return { error }
  }

  return { users, loading, updateRole, deleteUser }
}