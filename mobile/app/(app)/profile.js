import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { useAuthStore } from '../../src/stores/authStore'
import { supabase } from '../../src/lib/supabase'

const MARINE = '#0d1b3e'
const EMERALD = '#22c55e'

function Field({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#cbd5e1"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  )
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  )
}

export default function Profile() {
  const { profile, init, signOut } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('users').update(form).eq('id', profile.id)
    await init()
    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) return
    setSavingPwd(true)
    await supabase.auth.updateUser({ password: newPassword })
    setNewPassword('')
    setSavingPwd(false)
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{profile?.role}</Text>
        </View>
      </View>

      {success && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ Profil mis à jour</Text>
        </View>
      )}

      <Section title="Informations personnelles">
        <Field label="Prénom" value={form.first_name} onChangeText={v => setForm({ ...form, first_name: v })} placeholder="Prénom" />
        <Field label="Nom" value={form.last_name} onChangeText={v => setForm({ ...form, last_name: v })} placeholder="Nom" />
        <Field label="Téléphone" value={form.phone} onChangeText={v => setForm({ ...form, phone: v })} placeholder="+1 514 000 0000" keyboardType="phone-pad" />
      </Section>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.85}
      >
        {saving ? <ActivityIndicator color={MARINE} size="small" /> : <Text style={styles.saveBtnText}>✓ Enregistrer</Text>}
      </TouchableOpacity>

      <Section title="Sécurité">
        <Field label="Nouveau mot de passe" value={newPassword} onChangeText={setNewPassword} placeholder="Minimum 6 caractères" secureTextEntry />
      </Section>

      <TouchableOpacity
        style={[styles.saveBtn, styles.saveBtnDark, (savingPwd || newPassword.length < 6) && styles.saveBtnDisabled]}
        onPress={handleChangePassword}
        disabled={savingPwd || newPassword.length < 6}
        activeOpacity={0.85}
      >
        {savingPwd ? <ActivityIndicator color="#fff" size="small" /> : <Text style={[styles.saveBtnText, { color: '#fff' }]}>Changer le mot de passe</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOut} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 40 },
  header: { backgroundColor: MARINE, paddingTop: 60, paddingBottom: 24, alignItems: 'center' },
  avatarWrap: { width: 64, height: 64, borderRadius: 16, backgroundColor: EMERALD, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 24, fontWeight: '800', color: MARINE },
  name: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  roleBadge: { marginTop: 8, backgroundColor: 'rgba(34,197,94,0.15)', borderWidth: 0.5, borderColor: 'rgba(34,197,94,0.3)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  roleText: { fontSize: 11, fontWeight: '700', color: EMERALD, textTransform: 'capitalize' },
  successBanner: { backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 0.5, borderColor: 'rgba(34,197,94,0.3)', margin: 16, padding: 12, borderRadius: 10 },
  successText: { color: '#15803d', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 9, fontWeight: '700', color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, paddingHorizontal: 4 },
  sectionContent: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e2e8f0', overflow: 'hidden' },
  field: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  fieldInput: { fontSize: 14, color: MARINE, padding: 0 },
  saveBtn: { marginHorizontal: 16, marginTop: 12, backgroundColor: EMERALD, padding: 14, borderRadius: 10, alignItems: 'center' },
  saveBtnDark: { backgroundColor: MARINE },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: MARINE, fontSize: 14, fontWeight: '700' },
  signOut: { marginHorizontal: 16, marginTop: 12, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 0.5, borderColor: 'rgba(239,68,68,0.2)', padding: 14, borderRadius: 10, alignItems: 'center' },
  signOutText: { color: '#dc2626', fontSize: 14, fontWeight: '700' },
})