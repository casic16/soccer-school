import { Redirect } from 'expo-router'
import { useAuthStore } from '../src/stores/authStore'

export default function Index() {
  const { user, loading } = useAuthStore()

  if (loading) return null

  if (user) {
    return <Redirect href="/(app)/dashboard" />
  }

  return <Redirect href="/(auth)/login" />
}