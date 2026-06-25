import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useProfile = () => {
  const { profile, init } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const updateProfile = async (updates) => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      await init()
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const uploadAvatar = async (file) => {
    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const path = `${profile.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

    await updateProfile({ avatar_url: avatarUrl })
    setUploading(false)
  }

  const changePassword = async (newPassword) => {
    setSaving(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  return { updateProfile, uploadAvatar, changePassword, saving, uploading, error, success }
}