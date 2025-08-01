import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import axios from "axios";

const ModificationPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [sitesWeb, setSitesWeb] = useState<string[]>([""]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const token = localStorage.getItem("token");

  // Charger profil
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://instaclone-oise.onrender.com/api/profile-update/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setBio(res.data.bio || "");
        setGender(res.data.sexe || "");
        setSitesWeb(res.data.site_web?.length ? res.data.site_web : [""]);
        setShowSuggestions(res.data.show_account_suggestions ?? true);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // 📌 Ajouter un site web
  const handleAddSite = () => setSitesWeb([...sitesWeb, ""]);

  // 📌 Supprimer un site web
  const handleRemoveSite = (index: number) =>
    setSitesWeb(sitesWeb.filter((_, i) => i !== index));
  const handleChangeSite = (index: number, value: string) => {
    const newSites = [...sitesWeb];
    newSites[index] = value;
    setSitesWeb(newSites);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("genre", gender);
    formData.append("afficher_suggestions", String(showSuggestions));
    formData.append(
      "sites_web",
      JSON.stringify(sitesWeb.filter((s) => s.trim()))
    );

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      await axios.put(
        "https://instaclone-oise.onrender.com/api/profile-update/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("✅ Profil mis à jour !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la mise à jour");
    }
  };

  if (!profile) return <div className="text-white p-4">Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
              <img
                src={
                  photoFile
                    ? URL.createObjectURL(photoFile)
                    : profile.photo_url || "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg">
                {profile.nom_utilisateur}
              </h1>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>
          </div>
          <label className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
            Modifier la photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Bio */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Bio</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            rows={3}
          />
          <div className="text-xs text-gray-500 mt-1">{bio.length} / 150</div>
        </div>

        {/* Genre */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Genre</h2>
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white appearance-none"
            >
              <option value="">Je préfère ne pas répondre</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Sites Web */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Sites Web</h2>
          {sitesWeb.map((site, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                placeholder="https://..."
                value={site}
                onChange={(e) => handleChangeSite(index, e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
              />
              {sitesWeb.length > 1 && (
                <button
                  onClick={() => handleRemoveSite(index)}
                  className="text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddSite}
            className="flex items-center text-blue-500 mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Ajouter un lien
          </button>
        </div>

        {/* Afficher Suggestions */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">
            Afficher les suggestions de compte
          </h2>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showSuggestions ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showSuggestions ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Envoyer */}
        <div className="p-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModificationPage;
