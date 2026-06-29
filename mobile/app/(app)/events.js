import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'

export default function Events() {
  const { profile } = useAuthStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*, teams(name)')
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(10)
      setEvents(data || [])
      setLoading(false)
    }
    fetchEvents()
  }, [profile])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Événements à venir</Text>
      {loading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : events.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>Aucun événement à venir</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <View key={event.id} style={styles.card}>
              <View style={[styles.typeIcon, { backgroundColor: event.type === 'match' ? '#eff6ff' : '#f0fdf4' }]}>
                <Text style={{ fontSize: 24 }}>{event.type === 'match' ? '⚽' : '🏃'}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <Text style={styles.cardSub}>{event.teams?.name} • {event.location}</Text>
                <Text style={styles.cardDate}>
                  {new Date(event.start_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  typeIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  cardDate: { fontSize: 12, color: '#16a34a', marginTop: 4, fontWeight: '500' },
})