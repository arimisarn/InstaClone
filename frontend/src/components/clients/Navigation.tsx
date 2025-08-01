import { Home, Tv, Store, Users, Bell, Search, Menu } from "lucide-react";

export default function Navigation() {
  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        
        {/* Logo + Recherche */}
        <div className="flex items-center gap-3">
          <img
            src="/logo-facebook.png" // Mets ici ton logo ou celui de ton app
            alt="Logo"
            className="w-10 h-10"
          />
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Rechercher sur Facebook"
              className="bg-gray-100 pl-10 pr-4 py-1.5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Icônes centrales */}
        <nav className="flex gap-8 text-gray-500">
          <button className="flex flex-col items-center justify-center hover:text-blue-500">
            <Home size={24} />
          </button>
          <button className="flex flex-col items-center justify-center hover:text-blue-500">
            <Tv size={24} />
          </button>
          <button className="flex flex-col items-center justify-center hover:text-blue-500">
            <Store size={24} />
          </button>
          <button className="flex flex-col items-center justify-center hover:text-blue-500">
            <Users size={24} />
          </button>
        </nav>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-3">
          <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <Bell size={20} />
          </button>
          <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <Menu size={20} />
          </button>
          <img
            src="/profile.jpg" // photo de profil utilisateur
            alt="Profil"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
