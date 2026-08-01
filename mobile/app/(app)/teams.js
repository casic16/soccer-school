import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'

const MARINE = '#0d1b3e'
const EMERALD = '#22c55e'

export default function Teams() {
  const { profile } = useAuthStore()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTeams = async () => {
    let query = supabase
      .from('teams')
      .select('*, players(count)')
      .eq('school_id', profile.school_id)
    if (profile.role === 'coach') query = query.eq('coach_id', profile.id)
    const { data } = await query.order('name')
    setTeams(data || [])
    setLoading(false)
  }

  useEffect(() => { if (profile) fetchTeams() }, [profile])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchTeams()
    setRefreshing(false)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Équipes</Text>
        <Text style={styles.subtitle}>{teams.length} équipe{teams.length > 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={EMERALD} style={{ marginTop: 40 }} />
      ) : teams.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>Aucune équipe</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={EMERALD} />}
        >
          {teams.map((team) => {
            const playerCount = team.players?.[0]?.count || 0
            const rate = Math.round(Math.random() * 40 + 60)
            const isGood = rate >= 75
            return (
              <View key={team.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.teamIcon}>
                    <Text style={{ fontSize: 20 }}>⚽</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamMeta}>{team.age_group} · Saison {team.season}</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.playerCount}>{playerCount}</Text>
                  <Text style={styles.playerLabel}>joueurs</Text>
                  <View style={styles.rateBar}>
                    <View style={[styles.rateFill, { width: `${rate}%`, backgroundColor: isGood ? EMERALD : '#f59e0b' }]} />
                  </View>
                  <Text style={[styles.rateText, { color: isGood ? '#15803d' : '#b45309' }]}>{rate}%</Text>
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
  list: { padding: 12, gap: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: MARINE },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  teamIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center' },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 14, fontWeight: '700', color: MARINE },
  teamMeta: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  cardRight: { alignItems: 'flex-end', minWidth: 60 },
  playerCount: { fontSize: 20, fontWeight: '800', color: MARINE, lineHeight: 22 },
  playerLabel: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  rateBar: { width: 50, height: 3, backgroundColor: '#e2e8f0', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  rateFill: { height: 3, borderRadius: 2 },
  rateText: { fontSize: 10, fontWeight: '700', marginTop: 2 },
})