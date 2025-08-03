import { useState } from "react";
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
  const [recipientId, setRecipientId] = useState("");

  const token = localStorage.getItem("token"); // récupère le token stocké

  const fetchConversations = () => {
    axios
      .get("https://instaclone-oise.onrender.com/api/chat/conversations/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.error("Erreur récupération conversations", err));
  };

  const startConversation = () => {
    if (!recipientId.trim()) return;
    axios
      .post(
        "https://instaclone-oise.onrender.com/api/chat/send_message_to_user/",
        {
          recipient_id: parseInt(recipientId),
          text: "Salut 👋",
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        fetchConversations();
        setRecipientId("");
        onSelect(res.data.conversation_id);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="p-4 border-r w-64 h-screen overflow-auto bg-white">
      <h2 className="font-bold mb-4">Conversations</h2>

      {/* Nouveau message */}
      <div className="flex mb-4 space-x-2">
        <input
          type="number"
          placeholder="ID utilisateur"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
        <button
          onClick={startConversation}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          +
        </button>
      </div>

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
