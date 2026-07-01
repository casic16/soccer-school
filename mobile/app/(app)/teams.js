import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'
import { router } from 'expo-router'

export default function Teams() {
  const { profile } = useAuthStore()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    const fetchTeams = async () => {
      let query = supabase
        .from('teams')
        .select('*, players(count)')
        .eq('school_id', profile.school_id)

      if (profile.role === 'coach') {
        query = query.eq('coach_id', profile.id)
      }

      const { data } = await query.order('name')
      setTeams(data || [])
      setLoading(false)
    }
    fetchTeams()
  }, [profile])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Équipes</Text>
      {loading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : teams.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>Aucune équipe</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {teams.map((team) => (
            <TouchableOpacity key={team.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={{ fontSize: 24 }}>⚽</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{team.name}</Text>
                <Text style={styles.cardSub}>{team.age_group} — {team.season}</Text>
                <Text style={styles.cardPlayers}>
                  {team.players?.[0]?.count || 0} joueurs
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  cardPlayers: { fontSize: 12, color: '#16a34a', marginTop: 4, fontWeight: '500' },
})