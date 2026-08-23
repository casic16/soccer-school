import { useState, useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import Constants from 'expo-constants'

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

  const notificationListener = useRef(null)
  const responseListener = useRef(null)

  useEffect(() => {
    if (!profile) return

    registerForPushNotifications()
      .then((token) => {
        if (token) {
          setExpoPushToken(token)
          savePushToken(token, profile.id)
        }
      })
      .catch((error) => {
        console.error('Erreur push notifications:', error)
      })

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification reçue:', notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification cliquée:', response)
      })

    return () => {
      notificationListener.current?.remove?.()
      responseListener.current?.remove?.()
    }
  }, [profile])

  return { expoPushToken }
}

async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications nécessitent un vrai appareil')
    return null
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync()

  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync()

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

  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId

  if (!projectId) {
    console.error('EAS projectId introuvable')
    return null
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    })

    console.log('Expo Push Token:', token.data)

    return token.data
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du Expo Push Token:',
      error
    )

    return null
  }
}

async function savePushToken(token, userId) {
  const { error } = await supabase
    .from('users')
    .update({
      push_token: token,
    })
    .eq('id', userId)

  if (error) {
    console.error(
      'Erreur lors de la sauvegarde du push token:',
      error
    )
  }
}clearImmediate