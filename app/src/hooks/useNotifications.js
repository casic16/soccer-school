import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useNotifications = () => {
  const { profile } = useAuthStore()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('sent_at', { ascending: false })
        .limit(20)

      if (error) console.error('Notifications fetch error:', error)
      else {
        setNotifications(data || [])
        setUnreadCount(data?.filter((n) => !n.is_read).length || 0)
      }
      setLoading(false)
    }

    fetchNotifications()

    // Realtime — écoute les nouvelles notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${profile.id}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev])
        setUnreadCount((prev) => prev + 1)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [profile])

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', profile.id)
      .eq('is_read', false)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const markRead = async (id) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return { notifications, unreadCount, loading, markAllRead, markRead }
}