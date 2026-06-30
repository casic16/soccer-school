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
<<<<<<< HEAD

=======
>>>>>>> 954bbb9671e727280d891a568f8059f961c9047b
export const getDisplayName = (profile, language = 'en') => {
  if (!profile) return 'User'

  if (profile.first_name || profile.last_name) {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
  }

  if (profile.full_name) {
    return profile.full_name
  }

  if (language === 'fr') {
    return 'Utilisateur'
  }

  return 'User'
}
