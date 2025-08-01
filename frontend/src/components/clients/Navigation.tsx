import React, { useState } from "react";
import {
  Home,
  Users,
  Store,
  Monitor,
  MessageCircle,
  Menu,
  Bell,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const FacebookNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    console.log(query, results, handleSearch);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://instaclone-oise.onrender.com/api/search-users/?q=${encodeURIComponent(
          value
        )}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Section gauche - Logo et recherche */}
        <div className="flex items-center space-x-2 flex-1 max-w-xs">
          {/* Logo Facebook */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">f</span>
          </div>

          <SearchBar />
        </div>

        {/* Section centrale - Navigation principale */}
        <div className="flex items-center justify-center flex-1 max-w-md">
          <div className="flex space-x-2">
            {/* Accueil */}
            <Link to="/accueil">
              <button
                onClick={() => setActiveTab("home")}
                className={`relative p-3 rounded-lg transition-colors duration-200 ${
                  activeTab === "home"
                    ? "text-blue-500 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Home className="h-6 w-6" />
                {activeTab === "home" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t"></div>
                )}
              </button>
            </Link>
            
            <button
              onClick={() => setActiveTab("friends")}
              className={`relative p-3 rounded-lg transition-colors duration-200 ${
                activeTab === "friends"
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="h-6 w-6" />
              {activeTab === "friends" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("watch")}
              className={`relative p-3 rounded-lg transition-colors duration-200 ${
                activeTab === "watch"
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Monitor className="h-6 w-6" />
              {activeTab === "watch" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("marketplace")}
              className={`relative p-3 rounded-lg transition-colors duration-200 ${
                activeTab === "marketplace"
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Store className="h-6 w-6" />
              {activeTab === "marketplace" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t"></div>
              )}
            </button>

            {/* Gaming */}
            <button
              onClick={() => setActiveTab("gaming")}
              className={`relative p-3 rounded-lg transition-colors duration-200 ${
                activeTab === "gaming"
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="h-6 w-6 relative">
                <div className="absolute inset-0 bg-current rounded opacity-20"></div>
                <div className="absolute top-1 left-1 w-4 h-4 bg-current rounded opacity-60"></div>
              </div>
              {activeTab === "gaming" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t"></div>
              )}
            </button>
          </div>
        </div>

        {/* Section droite - Icones d'action et profil */}
        <div className="flex items-center space-x-2 flex-1 justify-end max-w-xs">
          {/* Menu grid */}
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          {/* Messenger */}
          <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <MessageCircle className="h-5 w-5 text-gray-700" />
            {/* Badge de notification */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              2
            </span>
          </button>

          {/* Notifications */}
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <Bell className="h-5 w-5 text-gray-700" />
          </button>

          {/* Profil utilisateur */}
          <button className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FacebookNavbar;
