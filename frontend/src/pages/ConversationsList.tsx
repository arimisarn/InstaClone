import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  nom_utilisateur: string;
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

  useEffect(() => {
    axios
      .get("/api/conversations/")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setConversations(data);
        } else if (Array.isArray(data.results)) {
          setConversations(data.results);
        } else {
          setConversations([]);
          console.warn("Réponse API inattendue :", data);
        }
      })
      .catch((err) => {
        console.error("Erreur récupération conversations", err);
        setConversations([]);
      });
  }, []);

  return (
    <div className="p-4 border-r w-64 h-screen overflow-auto bg-white">
      <h2 className="font-bold mb-4">Conversations</h2>
      {conversations.length === 0 && <p>Aucune conversation</p>}
      <ul>
        {Array.isArray(conversations) && conversations.length === 0 && (
          <p>Aucune conversation</p>
        )}
        <ul>
          {Array.isArray(conversations) &&
            conversations.map((conv) => {
              const names = conv.participants
                .map((p) => p.nom_utilisateur)
                .join(", ");
              return (
                <li
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className="cursor-pointer p-2 rounded hover:bg-gray-100"
                >
                  {names}
                </li>
              );
            })}
        </ul>
      </ul>
    </div>
  );
}
