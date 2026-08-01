import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'

const MARINE = '#0d1b3e'
const EMERALD = '#22c55e'

export default function Availability() {
  const { profile } = useAuthStore()
  const [availabilities, setAvailabilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    const { data } = await supabase
      .from('availabilities')
      .select('*, events(title, start_at, type), players(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20)
    setAvailabilities(data || [])
    setLoading(false)
  }

  useEffect(() => { if (profile) fetchData() }, [profile])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('availabilities').update({ status }).eq('id', id)
    setAvailabilities(prev => prev.filter(a => a.id !== id))
  }

  const formatDate = (str) => new Date(str).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Présences</Text>
        <Text style={styles.subtitle}>{availabilities.length} en attente</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={EMERALD} style={{ marginTop: 40 }} />
      ) : availabilities.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>Tout est à jour !</Text>
          <Text style={styles.emptyText}>Aucune présence en attente.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={EMERALD} />}
        >
          {availabilities.map((a) => {
            const isMatch = a.events?.type === 'match'
            return (
              <View key={a.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.typeIcon, { backgroundColor: isMatch ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)' }]}>
                    <Text style={{ fontSize: 18 }}>{isMatch ? '⚽' : '🏃'}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.eventTitle}>{a.events?.title}</Text>
                    <Text style={styles.eventMeta}>
                      {a.events?.start_at && formatDate(a.events.start_at)}
                    </Text>
                    {a.players?.full_name && (
                      <View style={styles.playerChip}>
                        <Text style={styles.playerChipText}>{a.players.full_name}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnGreen]}
                    onPress={() => updateStatus(a.id, 'confirmed')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnGreenText}>✓ Présent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnAmber]}
                    onPress={() => updateStatus(a.id, 'maybe')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnAmberText}>? Peut-être</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnRed]}
                    onPress={() => updateStatus(a.id, 'absent')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnRedText}>✗ Absent</Text>
                  </TouchableOpacity>
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
  header: { backgroundColor: MARINE, paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  list: { padding: 12, gap: 10 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: MARINE, marginBottom: 4 },
  emptyText: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  typeIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardInfo: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: MARINE },
  eventMeta: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  playerChip: { marginTop: 6, backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  playerChipText: { fontSize: 10, fontWeight: '600', color: '#15803d' },
  actions: { flexDirection: 'row', gap: 6 },
  btn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnGreen: { backgroundColor: 'rgba(34,197,94,0.12)' },
  btnGreenText: { fontSize: 11, fontWeight: '700', color: '#15803d' },
  btnAmber: { backgroundColor: 'rgba(245,158,11,0.12)' },
  btnAmberText: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  btnRed: { backgroundColor: 'rgba(239,68,68,0.12)' },
  btnRedText: { fontSize: 11, fontWeight: '700', color: '#b91c1c' },
})