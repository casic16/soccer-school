import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'

export default function Notifications() {
  const { profile } = useAuthStore()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    const fetch = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('sent_at', { ascending: false })
        .limit(20)
      setNotifications(data || [])
      setLoading(false)
    }
    fetch()
  }, [profile])

  const markRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {loading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.is_read && styles.cardUnread]}
              onPress={() => markRead(n.id)}
            >
              <View style={styles.dot}>
                {!n.is_read && <View style={styles.dotActive} />}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{n.message}</Text>
                <Text style={styles.cardDate}>
                  {new Date(n.sent_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#9ca3af' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardUnread: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' },
  dot: { width: 8, alignItems: 'center' },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a' },
  cardContent: { flex: 1 },
  cardText: { fontSize: 14, color: '#111827' },
  cardDate: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
})