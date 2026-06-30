cat > /workspaces/soccer-school/app/src/stores/authStore.js << 'ENDOFFILE'
import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) console.error('Profile fetch error:', error)
  return data
}

export const getDisplayName = (profile, language) => {
  if (language === 'ar' && profile?.full_name_ar) return profile.full_name_ar
  return profile?.full_name || ''
}

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const profile = await fetchProfile(session.user.id)
      set({ user: session.user, profile, loading: false })
    } else {
      set({ loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        set({ user: session.user, profile, loading: false })
      } else {
        set({ user: null, profile: null, loading: false })
      }
    })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
ENDOFFILE