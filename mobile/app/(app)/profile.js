import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react'
import { useAuthStore } from '../../src/stores/authStore'
import { supabase } from '../../src/lib/supabase'

export default function Profile() {
  const { profile, init, signOut } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
  })

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('users').update(form).eq('id', profile.id)
    await init()
    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>

      {success && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✓ Profil mis à jour</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{profile?.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={form.first_name}
          onChangeText={(v) => setForm({ ...form, first_name: v })}
          placeholder="Prénom"
        />
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={form.last_name}
          onChangeText={(v) => setForm({ ...form, last_name: v })}
          placeholder="Nom"
        />
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
          placeholder="Téléphone"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>{saving ? 'Enregistrement...' : '✓ Enregistrer'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  successBox: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  successText: { color: '#16a34a', fontSize: 14, fontWeight: '500' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  email: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  roleBadge: { marginTop: 8, backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { fontSize: 12, color: '#16a34a', fontWeight: '600', textTransform: 'capitalize' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12 },
  label: { fontSize: 13, color: '#6b7280', marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#f9fafb' },
  saveBtn: { backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  signOutBtn: { backgroundColor: '#fee2e2', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  signOutText: { color: '#dc2626', fontSize: 16, fontWeight: '600' },
})