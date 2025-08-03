import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Image, X } from "lucide-react";

interface User {
  nom_utilisateur: string;
}

interface Message {
  id: number;
  sender: User;
  text: string | null;
  image_url: string | null;
  created_at: string;
}

interface Props {
  conversationId: number;
  currentUsername: string; // pour afficher messages à droite/gauche
}

export default function ChatWindow({ conversationId, currentUsername }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Charger les messages
  useEffect(() => {
    if (!conversationId) return;
    axios
      .get(`/api/conversations/${conversationId}/`)
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) => console.error(err));
  }, [conversationId]);

  // 2. Scroll vers bas quand messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Aperçu image locale
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

  // 4. Upload image vers Supabase (exemple simple)
  async function uploadImageToSupabase(file: File): Promise<string> {
    const a = file
    console.log(a);
    
    // Ici, utilise ton client Supabase JS initialisé quelque part
    // Exemple (adapter selon ta config) :
    // const { data, error } = await supabase.storage.from('avatar').upload(fileName, file)
    // puis récupérer l'URL publique
    // return url;

    // Pour l'exemple, on simule un upload avec un delay et url factice :
    return new Promise((resolve) =>
      setTimeout(() => resolve("https://link-to-your-uploaded-image.jpg"), 1000)
    );
  }

  // 5. Envoyer message
  const sendMessage = async () => {
    if (!text.trim() && !imageFile) return;

    let image_url = null;
    if (imageFile) {
      image_url = await uploadImageToSupabase(imageFile);
    }

    await axios.post(
      `/api/conversations/${conversationId}/send_message/`,
      { text: text.trim() || null, image_url },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setText("");
    setImageFile(null);
    setPreview(null);

    // Recharge messages
    const res = await axios.get(`https://instaclone-oise.onrender.com/api/conversations/${conversationId}/`);
    setMessages(res.data.messages || []);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(messages || []).map((m) => (
          <div
            key={m.id}
            className={`max-w-xs p-3 rounded-2xl shadow-sm ${
              m.sender.nom_utilisateur === currentUsername
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white border"
            }`}
          >
            <p className="text-xs font-semibold mb-1">
              {m.sender.nom_utilisateur}
            </p>
            {m.text && <p className="whitespace-pre-line">{m.text}</p>}
            {m.image_url && (
              <img
                src={m.image_url}
                alt="message"
                className="mt-2 rounded-lg max-w-[200px]"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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
