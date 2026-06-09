import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: true,
  initialized: false,

  init: async (userId) => {
    if (get().initialized) return

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(20)

    if (!error) {
      set({
        notifications: data || [],
        unreadCount: data?.filter((n) => !n.is_read).length || 0,
        loading: false,
        initialized: true,
      })
    }

    // Realtime — une seule fois
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        set((state) => ({
          notifications: [payload.new, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      })
      .subscribe()

    // Cleanup
    return () => supabase.removeChannel(channel)
  },

  markAllRead: async (userId) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }))
  },

  markRead: async (id) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  reset: () => set({ notifications: [], unreadCount: 0, loading: true, initialized: false }),
}))