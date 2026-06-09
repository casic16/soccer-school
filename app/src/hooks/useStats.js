import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useStats = (teamId = null) => {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState({
    byPlayer: [],
    byEvent: [],
    summary: { confirmed: 0, absent: 0, maybe: 0, pending: 0, total: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchStats = async () => {
      let query = supabase
        .from('availabilities')
        .select('*, players(full_name, teams(name)), events(title, type, start_at)')

      if (teamId) {
        query = query.eq('players.team_id', teamId)
      }

      const { data, error } = await query
      if (error) {
        console.error('Stats fetch error:', error)
        setLoading(false)
        return
      }

      const records = data || []

      // Résumé global
      const summary = {
        confirmed: records.filter(r => r.status === 'confirmed').length,
        absent: records.filter(r => r.status === 'absent').length,
        maybe: records.filter(r => r.status === 'maybe').length,
        pending: records.filter(r => r.status === 'pending').length,
        total: records.length,
      }

      // Stats par joueur
      const playerMap = {}
      records.forEach((r) => {
        const name = r.players?.full_name || 'Inconnu'
        if (!playerMap[name]) {
          playerMap[name] = { name, confirmed: 0, absent: 0, maybe: 0, pending: 0, total: 0 }
        }
        playerMap[name][r.status]++
        playerMap[name].total++
      })
      const byPlayer = Object.values(playerMap).sort((a, b) => b.confirmed - a.confirmed)

      // Stats par événement
      const eventMap = {}
      records.forEach((r) => {
        const title = r.events?.title || 'Inconnu'
        if (!eventMap[title]) {
          eventMap[title] = { title, type: r.events?.type, confirmed: 0, absent: 0, maybe: 0, pending: 0, total: 0 }
        }
        eventMap[title][r.status]++
        eventMap[title].total++
      })
      const byEvent = Object.values(eventMap)

      setStats({ byPlayer, byEvent, summary })
      setLoading(false)
    }

    fetchStats()
  }, [profile, teamId])

  return { stats, loading }
}