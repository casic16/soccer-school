import { useState, useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const usePushNotifications = () => {
  const { profile } = useAuthStore()
  const [expoPushToken, setExpoPushToken] = useState(null)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    if (!profile) return

    registerForPushNotifications().then(token => {
      if (token) {
        setExpoPushToken(token)
        savePushToken(token, profile.id)
      }
    })

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification cliquée:', response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [profile])

  return { expoPushToken }
}

async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications nécessitent un vrai appareil')
    return null
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Permission refusée')
    return null
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Fariki',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22c55e',
    })
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'fariki',
  })

  return token.data
}

async function savePushToken(token, userId) {
  await supabase
    .from('users')
    .update({ push_token: token })
    .eq('id', userId)
}