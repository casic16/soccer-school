import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { useState, useCallback } from 'react'
import { useAuthStore } from '../../src/stores/authStore'
import { router } from 'expo-router'

const MARINE = '#0d1b3e'
const EMERALD = '#22c55e'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const cards = [
    { icon: '📅', label: 'Événements', route: '/(app)/events', count: null },
    { icon: '✅', label: 'Présences', route: '/(app)/availability', count: null },
    { icon: '🔔', label: 'Notifications', route: '/(app)/notifications', count: null },
    { icon: '👤', label: 'Profil', route: '/(app)/profile', count: null },
  ]

  if (['admin', 'coach'].includes(profile?.role)) {
    cards.unshift({ icon: '👥', label: 'Équipes', route: '/(app)/teams', count: null })
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={EMERALD}
          colors={[EMERALD]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour {profile?.full_name?.split(' ')[0]} 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile?.role}</Text>
          </View>
        </View>
      </View>

      {/* KPI Strip */}
      <View style={styles.kpiStrip}>
        <View style={styles.kpiItem}>
          <Text style={styles.kpiValue}>5</Text>
          <Text style={styles.kpiLabel}>Équipes</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiItem}>
          <Text style={styles.kpiValue}>87</Text>
          <Text style={styles.kpiLabel}>Joueurs</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={[styles.kpiItem]}>
          <Text style={[styles.kpiValue, { color: EMERALD }]}>78%</Text>
          <Text style={styles.kpiLabel}>Présence</Text>
        </View>
      </View>

      {/* Grid */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(card.route)}
            activeOpacity={0.75}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
            {card.count && (
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{card.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOut} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: MARINE,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  roleBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(34,197,94,0.4)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: EMERALD,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  kpiStrip: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  kpiItem: { flex: 1, alignItems: 'center' },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: MARINE,
    letterSpacing: -0.5,
  },
  kpiLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiDivider: {
    width: 0.5,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 20,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: {
    fontSize: 12,
    color: MARINE,
    fontWeight: '600',
  },
  cardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cardBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  signOut: {
    marginHorizontal: 16,
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#fecaca',
  },
  signOutText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
})