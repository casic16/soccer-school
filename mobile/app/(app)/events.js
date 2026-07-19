import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'

const MARINE = '#0d1b3e'
const EMERALD = '#22c55e'

export default function Events() {
  const { profile } = useAuthStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, teams(name)')
      .gte('start_at', new Date().toISOString())
      .order('start_at', { ascending: true })
      .limit(15)
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { if (profile) fetchEvents() }, [profile])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchEvents()
    setRefreshing(false)
  }, [])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Événements à venir</Text>
        <Text style={styles.subtitle}>{events.length} événement{events.length !== 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={EMERALD} style={{ marginTop: 60 }} />
      ) : events.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>Aucun événement</Text>
          <Text style={styles.emptyText}>Les prochains matchs et entraînements apparaîtront ici.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={EMERALD} />}
        >
          {events.map((event) => {
            const { day, time } = formatDate(event.start_at)
            const isMatch = event.type === 'match'
            return (
              <View key={event.id} style={styles.card}>
                <View style={[styles.typeBar, { backgroundColor: isMatch ? EMERALD : '#3b82f6' }]} />
                <View style={[styles.iconWrap, { backgroundColor: isMatch ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)' }]}>
                  <Text style={{ fontSize: 20 }}>{isMatch ? '⚽' : '🏃'}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <View style={[styles.typePill, { backgroundColor: isMatch ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)' }]}>
                      <Text style={[styles.typePillText, { color: isMatch ? '#15803d' : '#1d4ed8' }]}>
                        {isMatch ? 'Match' : 'Entraînement'}
                      </Text>
                    </View>
                    <Text style={styles.teamName}>{event.teams?.name}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.location && <Text style={styles.location}>📍 {event.location}</Text>}
                </View>
                <View style={styles.dateWrap}>
                  <Text style={styles.dateDay}>{day}</Text>
                  <Text style={styles.dateTime}>{time}</Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: MARINE,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  list: { padding: 12, gap: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: MARINE, marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBar: { width: 3, alignSelf: 'stretch' },
  iconWrap: { width: 44, height: 44, margin: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, paddingVertical: 12, paddingRight: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  typePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typePillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  teamName: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  eventTitle: { fontSize: 13, fontWeight: '700', color: MARINE },
  location: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  dateWrap: { paddingRight: 14, alignItems: 'flex-end' },
  dateDay: { fontSize: 12, fontWeight: '700', color: MARINE },
  dateTime: { fontSize: 10, color: '#94a3b8', marginTop: 1 },
})