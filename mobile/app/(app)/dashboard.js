import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuthStore } from '../../src/stores/authStore'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour {profile?.full_name} 👋</Text>
        <Text style={styles.role}>{profile?.role}</Text>
      </View>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>👥</Text>
          <Text style={styles.cardLabel}>Équipes</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.cardLabel}>Événements</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>✅</Text>
          <Text style={styles.cardLabel}>Présences</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20 },
  header: { marginTop: 60, marginBottom: 32 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  role: { fontSize: 14, color: '#6b7280', marginTop: 4, textTransform: 'capitalize' },
  cards: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  signOut: { marginTop: 'auto', backgroundColor: '#fee2e2', padding: 14, borderRadius: 12, alignItems: 'center' },
  signOutText: { color: '#dc2626', fontWeight: '600' },
})