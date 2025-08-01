import { useState, useEffect } from "react";
import { X, Grid3X3, Bookmark, UserCheck, Camera, Plus } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
interface ProfileData {
  nom_utilisateur: string;
  email: string;
  photo_url: string | null;
  bio: string;
  nb_publications: number;
  followers: number;
  following: number;
  sites_web?: string[];
}

// const DEFAULT_AVATAR = "/default-avatar.png"; // mettre le chemin vers une image par défaut dans public

const Profile = () => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState("grid");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token d'authentification manquant.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          "https://instaclone-oise.onrender.com/api/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleNoteSubmit = () => {
    console.log("Note partagée:", noteText);
    setNoteText("");
    setShowNoteModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Chargement...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Profil introuvable
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-lg font-medium">{profile.nom_utilisateur}</span>
        <div className="flex items-center space-x-4">
          <Link to="/modification-profile">
            <button className="px-4 py-1 border border-gray-600 rounded-md text-sm font-medium">
              Modifier le profil
            </button>
          </Link>
          <button className="px-4 py-1 border border-gray-600 rounded-md text-sm font-medium">
            Voir l'archive
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <div className="flex items-start space-x-8">
          {/* Photo de profil */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800">
              <img
                src={
                  profile.photo_url && profile.photo_url.trim() !== ""
                    ? profile.photo_url
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setShowNoteModal(true)}
              className="absolute -top-2 -right-2 bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-600"
            >
              Note...
            </button>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <div className="font-semibold">{profile.nb_publications}</div>
                <div className="text-gray-400 text-sm">publications</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{profile.followers}</div>
                <div className="text-gray-400 text-sm">followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{profile.following}</div>
                <div className="text-gray-400 text-sm">suivi(e)s</div>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="font-semibold">{profile.nom_utilisateur}</h2>
              <p className="text-gray-400">{profile.bio}</p>
            </div>
          </div>
          {profile.sites_web && profile.sites_web.length > 0 && (
            <div className="mt-2 space-y-1">
              {profile.sites_web.map((site: string, index: number) => (
                <a
                  key={index}
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline break-all"
                >
                  {site}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Add Story Circle */}
        <div className="mt-8 flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Nouveau</span>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-t border-gray-800 flex">
        <button
          onClick={() => setActiveTab("grid")}
          className={`flex-1 flex items-center justify-center py-3 ${
            activeTab === "grid"
              ? "border-t-2 border-white text-white"
              : "text-gray-400"
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`flex-1 flex items-center justify-center py-3 ${
            activeTab === "bookmarks"
              ? "border-t-2 border-white text-white"
              : "text-gray-400"
          }`}
        >
          <Bookmark className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab("tagged")}
          className={`flex-1 flex items-center justify-center py-3 ${
            activeTab === "tagged"
              ? "border-t-2 border-white text-white"
              : "text-gray-400"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="flex-1">
        {activeTab === "grid" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-light mb-2">Partager des photos</h3>
            <p className="text-gray-400 text-center mb-4 max-w-xs">
              Lorsque vous partagez des photos, elles apparaissent sur votre
              profil.
            </p>
            <button className="text-blue-400 font-medium">
              Partager votre première photo
            </button>
          </div>
        )}
      </div>

      {/* Modal Note */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-75"
            onClick={() => setShowNoteModal(false)}
          ></div>
          <div className="relative bg-gray-900 rounded-3xl p-6 mx-4 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold">Nouvelle note</h2>
              <button
                onClick={handleNoteSubmit}
                className="text-blue-400 font-semibold hover:text-blue-300"
                disabled={!noteText.trim()}
              >
                Partager
              </button>
            </div>
            <input
              type="text"
              placeholder="Partagez vos idées..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 text-sm text-center w-full outline-none"
              maxLength={60}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
