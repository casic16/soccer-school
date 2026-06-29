import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAuthStore } from '../src/stores/authStore'

export default function RootLayout() {
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  )
}