import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useAuthStore } from '../../src/stores/authStore'

export default function Availability() {
  const { profile } = useAuthStore()
  const [availabilities, setAvailabilities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    const fetch = async () => {
      const { data } = await supabase
        .from('availabilities')
        .select('*, events(title, start_at, type), players(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)
      setAvailabilities(data || [])
      setLoading(false)
    }
    fetch()
  }, [profile])

  const updateStatus = async (id, status) => {
    await supabase.from('availabilities').update({ status }).eq('id', id)
    setAvailabilities(prev => prev.filter(a => a.id !== id))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Présences en attente</Text>
      {loading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : availabilities.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyText}>Tout est à jour !</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {availabilities.map((a) => (
            <View key={a.id} style={styles.card}>
              <Text style={styles.cardTitle}>{a.events?.title}</Text>
              <Text style={styles.cardSub}>
                {a.events?.start_at && new Date(a.events.start_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.btn, styles.btnGreen]} onPress={() => updateStatus(a.id, 'confirmed')}>
                  <Text style={styles.btnText}>✓ Présent</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnYellow]} onPress={() => updateStatus(a.id, 'maybe')}>
                  <Text style={[styles.btnText, { color: '#92400e' }]}>? Peut-être</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => updateStatus(a.id, 'absent')}>
                  <Text style={[styles.btnText, { color: '#991b1b' }]}>✗ Absent</Text>
                </TouchableOpacity>
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardSub: { fontSize: 12, color: '#9ca3af', marginTop: 2, marginBottom: 12 },
  buttons: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnGreen: { backgroundColor: '#16a34a' },
  btnYellow: { backgroundColor: '#fef3c7' },
  btnRed: { backgroundColor: '#fee2e2' },
  btnText: { fontSize: 12, fontWeight: '600', color: '#fff' },
})