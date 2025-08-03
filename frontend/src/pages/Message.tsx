import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Image, X } from "lucide-react";

interface Message {
  id: number;
  sender: { nom_utilisateur: string };
  text: string;
  image_url?: string;
}

export default function ChatPage() {
  // Simule le nom d'utilisateur connecté, remplace par ta vraie logique d'auth
  const currentUsername = "moi";

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/conversations/1/");
      console.log("fetchMessages res.data =", res.data);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Erreur fetchMessages", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Scroll vers le bas quand messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    await axios.post("/api/conversations/1/send_message/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setText("");
    setImage(null);
    setPreview(null);
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages */}
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

      {/* Preview image */}
      {preview && (
        <div className="p-2 border-t bg-white flex items-center justify-between">
          <img src={preview} alt="preview" className="h-20 rounded-lg" />
          <button
            onClick={() => {
              setImage(null);
              setPreview(null);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Input */}
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
