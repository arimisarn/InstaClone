import { useState } from "react";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  // Tu peux remplacer "moi" par le nom de l'utilisateur connecté
  const currentUsername = "moi";

  return (
    <div className="flex h-screen">
      <ConversationsList onSelect={setSelectedConversationId} />
      {selectedConversationId ? (
        <ChatWindow conversationId={selectedConversationId} currentUsername={currentUsername} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Sélectionne une conversation
        </div>
      )}
    </div>
  );
}
