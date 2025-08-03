import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  nom_utilisateur: string;
  photo?: string; // URL photo
}

interface Conversation {
  id: number;
  participants: User[];
  created_at: string;
}

interface Props {
  onSelect: (id: number) => void;
}

export default function ConversationsList({ onSelect }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const token = localStorage.getItem("token");

  // Charger conversations existantes
  const fetchConversations = () => {
    axios
      .get("https://instaclone-oise.onrender.com/api/chat/conversations/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.error("Erreur récupération conversations", err));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Rechercher un utilisateur par nom
  const searchUser = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    axios
      .get(
        `https://instaclone-oise.onrender.com/api/chat/search_user/?q=${encodeURIComponent(
          query
        )}`,
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => setSearchResults(res.data || []))
      .catch((err) => console.error("Erreur recherche utilisateur", err));
  };

  // Démarrer conversation avec un utilisateur
  const startConversation = (recipientId: number) => {
    axios
      .post(
        "https://instaclone-oise.onrender.com/api/chat/send_message_to_user/",
        { recipient_id: recipientId, text: "Salut 👋" },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => {
        fetchConversations();
        setSearchQuery("");
        setSearchResults([]);
        onSelect(res.data.conversation_id);
      })
      .catch((err) => console.error("Erreur démarrage conversation", err));
  };

  return (
    <div className="p-4 border-r w-64 h-screen overflow-auto bg-white">
      <h2 className="font-bold mb-4">Conversations</h2>

      {/* Barre de recherche utilisateur */}
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={searchQuery}
        onChange={(e) => searchUser(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-2"
      />

      {/* Résultats recherche */}
      {searchResults.length > 0 && (
        <ul className="border rounded mb-4 bg-white shadow">
          {searchResults.map((user) => (
            <li
              key={user.id}
              onClick={() => startConversation(user.id)}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={
                  user.photo ||
                  "https://via.placeholder.com/40x40.png?text=User"
                }
                alt={user.nom_utilisateur}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.nom_utilisateur}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Liste conversations */}
      {conversations.length === 0 && <p>Aucune conversation</p>}
      <ul>
        {Array.isArray(conversations) &&
          conversations.map((conv) => {
            const otherParticipants = conv.participants; // peut être filtré si tu veux exclure toi-même
            const names = otherParticipants
              .map((p) => p.nom_utilisateur)
              .join(", ");
            const photo =
              otherParticipants[0]?.photo ||
              "https://via.placeholder.com/40x40.png?text=User";

            return (
              <li
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={photo}
                  alt={names}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{names}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
