import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useAuthStore } from '../../src/stores/authStore'
import { router } from 'expo-router'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()

  const adminCards = [
    { icon: '👥', label: 'Équipes', route: '/(app)/teams' },
    { icon: '📅', label: 'Événements', route: '/(app)/events' },
    { icon: '✅', label: 'Présences', route: '/(app)/availability' },
    { icon: '🔔', label: 'Notifications', route: '/(app)/notifications' },
    { icon: '👤', label: 'Profil', route: '/(app)/profile' },
  ]

  const parentPlayerCards = [
    { icon: '📅', label: 'Événements', route: '/(app)/events' },
    { icon: '✅', label: 'Présences', route: '/(app)/availability' },
    { icon: '🔔', label: 'Notifications', route: '/(app)/notifications' },
    { icon: '👤', label: 'Profil', route: '/(app)/profile' },
  ]

  const cards = ['admin', 'coach'].includes(profile?.role) ? adminCards : parentPlayerCards

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour {profile?.full_name} 👋</Text>
        <Text style={styles.role}>{profile?.role}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(card.route)}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20 },
  header: { marginTop: 60, marginBottom: 32 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  role: { fontSize: 14, color: '#6b7280', marginTop: 4, textTransform: 'capitalize' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  card: { width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardLabel: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  signOut: { backgroundColor: '#fee2e2', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  signOutText: { color: '#dc2626', fontWeight: '600' },
})