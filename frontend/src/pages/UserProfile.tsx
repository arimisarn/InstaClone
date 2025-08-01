import { useState, useEffect } from "react";
import { Grid3X3, UserCheck, Camera, Plus } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ProfileData {
  nom_utilisateur: string;
  email: string;
  photo_url: string | null;
  bio: string;
  nb_publications: number;
  followers: number;
  following: number;
  sites_web?: string[];
  is_following?: boolean;
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `https://instaclone-oise.onrender.com/api/users/${username}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setProfile(res.data);
        setFollowing(res.data.is_following || false);
      } catch (err) {
        console.error("Erreur profil utilisateur :", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const toggleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (following) {
        await axios.post(
          `https://instaclone-oise.onrender.com/api/unfollow/${username}/`,
          {},
          { headers: { Authorization: `Token ${token}` } }
        );
        setFollowing(false);
      } else {
        await axios.post(
          `https://instaclone-oise.onrender.com/api/follow/${username}/`,
          {},
          { headers: { Authorization: `Token ${token}` } }
        );
        setFollowing(true);
      }
      // Recharger le profil avec la nouvelle valeur de followers
      const res = await axios.get(
        `https://instaclone-oise.onrender.com/api/users/${username}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setProfile(res.data);
    } catch (err) {
      console.error("Erreur suivi :", err);
    }
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
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <div className="flex items-start space-x-8">
          {/* Photo */}
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
          </div>

          {/* Stats + Bio */}
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
              {profile.sites_web &&
                profile.sites_web.map((site, i) => (
                  <a
                    key={i}
                    href={site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline block"
                  >
                    {site}
                  </a>
                ))}
            </div>

            {/* Boutons */}
            <div className="flex space-x-3 mt-4">
              <button
                onClick={toggleFollow}
                className={`px-4 py-1 rounded-md text-sm font-medium ${
                  following
                    ? "bg-gray-700 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {following ? "Suivi" : "Suivre"}
              </button>
              <button className="px-4 py-1 bg-gray-700 text-white rounded-md text-sm font-medium">
                Contacter
              </button>
            </div>
          </div>
        </div>

        {/* Nouveau cercle Story */}
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
        <button className="flex-1 flex items-center justify-center py-3 border-t-2 border-white text-white">
          <Grid3X3 className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-gray-400">
          <UserCheck className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu onglets */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-light mb-2">Aucune photo</h3>
      </div>
    </div>
  );
};

export default UserProfile;
