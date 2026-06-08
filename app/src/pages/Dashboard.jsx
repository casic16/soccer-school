import { useAuthStore } from '../stores/authStore'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-green-600">Soccer School</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {profile?.full_name || 'Utilisateur'}
          </span>
          <button
            onClick={signOut}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Bonjour {profile?.full_name} 👋
        </h2>
        <p className="text-gray-500 mb-8">
          Rôle : <span className="font-medium capitalize">{profile?.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Équipes</p>
            <p className="text-3xl font-bold text-green-600 mt-1">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Événements à venir</p>
            <p className="text-3xl font-bold text-green-600 mt-1">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Présences en attente</p>
            <p className="text-3xl font-bold text-green-600 mt-1">—</p>
          </div>
        </div>
      </main>
    </div>
  )
}