/* app/admin/page.tsx */
export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#1E201E] p-8 text-[#ECDFCC]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 border-b border-gray-600 pb-4">
          Admin Portal
        </h1>
        
        <p className="mb-8 text-lg">
          Welcome to the administrator dashboard. Select a module to manage the system.
        </p>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Manage Movies */}
          <div className="bg-[#3C3D37] p-6 rounded-xl shadow-lg hover:bg-[#697565] transition-colors cursor-pointer border border-gray-600">
            <h2 className="text-2xl font-bold mb-2">Manage Movies</h2>
            <p className="text-sm text-gray-300">Add, edit, or remove movies from the catalog.</p>
          </div>

          {/* Manage Promotions */}
          <div className="bg-[#3C3D37] p-6 rounded-xl shadow-lg hover:bg-[#697565] transition-colors cursor-pointer border border-gray-600">
            <h2 className="text-2xl font-bold mb-2">Promotions</h2>
            <p className="text-sm text-gray-300">Create discount codes and email promotional campaigns.</p>
          </div>

          {/* Manage Users */}
          <div className="bg-[#3C3D37] p-6 rounded-xl shadow-lg hover:bg-[#697565] transition-colors cursor-pointer border border-gray-600">
            <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
            <p className="text-sm text-gray-300">Suspend accounts, reset passwords, or elevate privileges.</p>
          </div>

          {/* Manage Showtimes */}
          <div className="bg-[#3C3D37] p-6 rounded-xl shadow-lg hover:bg-[#697565] transition-colors cursor-pointer border border-gray-600">
            <h2 className="text-2xl font-bold mb-2">Showtimes</h2>
            <p className="text-sm text-gray-300">Schedule movie screenings and assign theater rooms.</p>
          </div>

        </div>
      </div>
    </main>
  );
}