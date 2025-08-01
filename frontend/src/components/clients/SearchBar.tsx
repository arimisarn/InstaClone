import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface UserSuggestion {
  id: number;
  nom_utilisateur: string;
  photo_url: string | null;
}

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Gestion clic hors dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Charger historique
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  const saveHistory = (newHistory: string[]) => {
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Recherche API
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://instaclone-oise.onrender.com/api/search-users/?q=${query}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Erreur recherche:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Ajouter à l’historique
  const addToHistory = (term: string) => {
    if (!term.trim()) return;
    const newHistory = [term, ...searchHistory.filter((h) => h !== term)];
    saveHistory(newHistory.slice(0, 5));
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showDropdown && (
        <div className="absolute mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          {query.trim() !== "" ? (
            suggestions.length > 0 ? (
              suggestions.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    addToHistory(user.nom_utilisateur);
                    setQuery("");
                    setShowDropdown(false);
                    navigate(`/user/${user.nom_utilisateur}`);
                  }}
                >
                  <img
                    src={user.photo_url || "/default-avatar.png"}
                    alt={user.nom_utilisateur}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <span>{user.nom_utilisateur}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Aucun résultat
              </div>
            )
          ) : (
            // Historique
            <>
              {searchHistory.length > 0 ? (
                <>
                  <div className="px-3 py-1 text-gray-400 text-xs">
                    Recherches récentes
                  </div>
                  {searchHistory.map((term, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setQuery(term);
                        setShowDropdown(false);
                        navigate(`/user/${term}`);
                      }}
                    >
                      {term}
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Aucune recherche récente
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
