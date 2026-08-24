export const roleThemes = {
  admin: {
    accent: '#ff6b00',
    accentSoft: 'rgba(255, 107, 0, 0.12)',
    accentBorder: 'rgba(255, 107, 0, 0.28)',
  },

  coach: {
    accent: '#3b82f6',
    accentSoft: 'rgba(59, 130, 246, 0.12)',
    accentBorder: 'rgba(59, 130, 246, 0.28)',
  },

  parent: {
    accent: '#8b5cf6',
    accentSoft: 'rgba(139, 92, 246, 0.12)',
    accentBorder: 'rgba(139, 92, 246, 0.28)',
  },

  player: {
    accent: '#22c55e',
    accentSoft: 'rgba(34, 197, 94, 0.12)',
    accentBorder: 'rgba(34, 197, 94, 0.28)',
  },

  super_admin: {
    accent: '#ef4444',
    accentSoft: 'rgba(239, 68, 68, 0.12)',
    accentBorder: 'rgba(239, 68, 68, 0.28)',
  },
}

export function getRoleTheme(role) {
  return roleThemes[role] || roleThemes.admin
}