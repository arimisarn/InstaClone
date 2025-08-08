import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Image, X } from "lucide-react";

// Config axios globale avec baseURL et token d'authentification
axios.defaults.baseURL = "https://instaclone-oise.onrender.com";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
});

interface User {
  id: number;
  nom_utilisateur: string;
  profile?: {
    photo_url?: string | null;
  };
}

interface Message {
  id: number;
  sender: User;
  text: string | null;
  image_url: string | null;
  created_at: string;
}

interface Conversation {
  id: number;
  participants: User[];
  created_at: string;
  messages?: Message[];
}

interface Props {
  conversationId: number;
  currentUsername: string;
}

export default function ChatWindow({ conversationId, currentUsername }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger la conversation complète (messages + participants)
  const fetchConversation = async () => {
    if (!conversationId) return;
    try {
      const res = await axios.get(
        `https://instaclone-oise.onrender.com/api/chat/conversations/${conversationId}/`
      );
      setConversation(res.data);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Erreur récupération conversation", err);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Aperçu local de l'image sélectionnée
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Simuler upload image vers Supabase (à remplacer par ta logique)
  async function uploadImageToSupabase(file: File): Promise<string> {
    console.log(file);

    return new Promise((resolve) =>
      setTimeout(
        () => resolve("https://via.placeholder.com/200x200.png?text=Image"),
        1000
      )
    );
  }

  // Envoyer un message (texte + image)
  const sendMessage = async () => {
    if (!text.trim() && !imageFile) return;

    let image_url = null;
    if (imageFile) {
      image_url = await uploadImageToSupabase(imageFile);
    }

    try {
      await axios.post(
        `https://instaclone-oise.onrender.com/api/chat/conversations/${conversationId}/send_message_to_user/`,
        { text: text.trim() || null, image_url }
      );
      setText("");
      setImageFile(null);
      setPreview(null);
      fetchConversation();
    } catch (err) {
      console.error("Erreur envoi message", err);
    }
  };

  // Trouver interlocuteur (participant différent de l'utilisateur courant)
  const interlocuteur = conversation?.participants.find(
    (p) => p.nom_utilisateur !== currentUsername
  );

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* HEADER avec photo + nom */}
      {interlocuteur && (
        <div className="flex items-center p-4 border-b bg-white shadow-sm sticky top-0 z-10">
          <img
            src={
              interlocuteur.profile?.photo_url ||
              "https://via.placeholder.com/40x40.png?text=User"
            }
            alt={interlocuteur.nom_utilisateur}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <span className="font-semibold">{interlocuteur.nom_utilisateur}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMine = m.sender.nom_utilisateur === currentUsername;
          return (
            <div
              key={m.id}
              className={`flex items-end space-x-2 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              {!isMine && (
                <img
                  src={
                    m.sender?.profile?.photo_url ||
                    "https://via.placeholder.com/40x40.png?text=User"
                  }
                  alt={m.sender.nom_utilisateur}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div
                className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                  isMine
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {m.text && <p className="whitespace-pre-line">{m.text}</p>}
                {m.image_url && (
                  <img
                    src={m.image_url}
                    alt="message"
                    className="mt-2 rounded-lg max-w-[200px]"
                  />
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Aperçu image */}
      {preview && (
        <div className="p-2 border-t bg-white flex items-center justify-between">
          <img src={preview} alt="preview" className="h-20 rounded-lg" />
          <button
            onClick={() => {
              setImageFile(null);
              setPreview(null);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Barre d'envoi */}
      <div className="border-t p-3 bg-white flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Image className="h-6 w-6 text-gray-600" />
        </button>

        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
