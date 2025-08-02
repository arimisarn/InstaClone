import { useState } from "react";
import { Camera, Type, Settings, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateStory = () => {
  const [mode, setMode] = useState<"home" | "text" | "photo">("home");
  const [text, setText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Épuré");
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const fonts = ["Épuré", "Moderne", "Classique", "Fantaisie"];
  const colors = [
    "#2563eb",
    "#ec4899",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#000000",
    "#8b5cf6",
    "#a855f7",
    "#f97316",
    "#ffffff",
    "#eab308",
    "#78716c",
    "#1f2937",
    "#7c3aed",
    "#f472b6",
    "#fb923c",
  ];

  const handleImageSelect = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setMode("photo");
  };

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    if (mode === "text" && text.trim()) {
      formData.append("text", text);
      formData.append("background_color", selectedColor);
      formData.append("font", selectedFont);
    }
    if (mode === "photo" && image) {
      formData.append("image", image);
      if (text.trim()) formData.append("text", text);
    }

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

  if (mode === "text") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 p-4 space-y-6 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Story texte</h2>
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setMode("home")}
            />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Commencez à écrire..."
            className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
          />

          {/* Font selector */}
          <div>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-sm mb-2">Couleur fond</label>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === c ? "border-white" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex space-x-4">
            <button
              onClick={() => setMode("home")}
              className="flex-1 py-2 bg-gray-700 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 py-2 bg-blue-600 rounded-lg"
            >
              Publier
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <div
            className="w-80 h-96 rounded-2xl flex items-center justify-center p-4"
            style={{ backgroundColor: selectedColor }}
          >
            <p
              className={`text-center text-xl ${
                selectedColor === "#ffffff" ? "text-black" : "text-white"
              }`}
              style={{
                fontFamily:
                  selectedFont === "Épuré"
                    ? "system-ui"
                    : selectedFont === "Moderne"
                    ? "Arial"
                    : selectedFont === "Classique"
                    ? "Times New Roman"
                    : "Comic Sans MS",
              }}
            >
              {text || "Commencez à écrire..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "photo") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        <div className="w-80 bg-gray-800 p-4 space-y-6 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Story photo</h2>
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setMode("home")}
            />
          </div>

          <input
            type="text"
            placeholder="Ajouter du texte..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />

          <div className="absolute bottom-4 left-4 right-4 flex space-x-4">
            <button
              onClick={() => setMode("home")}
              className="flex-1 py-2 bg-gray-700 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 py-2 bg-blue-600 rounded-lg"
            >
              Publier
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex items-center justify-center bg-black">
          {imagePreview && (
            <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {text && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <p className="text-white text-lg font-bold text-center drop-shadow-lg">
                    {text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // HOME
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Créer une story</h2>
        <Settings className="w-6 h-6 text-gray-400" />
      </div>

      <div className="flex justify-center space-x-4 px-8 py-12">
        {/* Photo */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageSelect(e.target.files[0])
            }
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="w-48 h-80 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-center font-medium px-4">
              Créer une story photo
            </span>
          </div>
        </div>

        {/* Texte */}
        <div
          onClick={() => setMode("text")}
          className="w-48 h-80 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center mb-4">
            <Type className="w-6 h-6 text-white" />
          </div>
          <span className="text-center font-medium px-4">
            Créer une story texte
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
