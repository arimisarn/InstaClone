import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateStory = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      await axios.post(
        "https://instaclone-oise.onrender.com/api/story/create/",
        formData,
        { headers: { Authorization: `Token ${token}` } }
      );
      navigate("/");
    } catch (err) {
      console.error("Erreur création story", err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Créer une story</h2>

      {/* Choix texte */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez quelque chose..."
        className="w-full p-3 rounded-lg bg-gray-800 mb-4"
      />

      {/* Choix image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 px-4 py-2 rounded-lg w-full"
      >
        Partager
      </button>
    </div>
  );
};

export default CreateStory;
