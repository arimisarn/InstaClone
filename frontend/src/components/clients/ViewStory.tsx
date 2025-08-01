import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Heart, X } from "lucide-react";

interface Story {
  id: number;
  user_nom_utilisateur: string;
  user_photo: string;
  image_url: string | null;
  text: string | null;
  likes_count: number;
  liked_by_me: boolean;
  views_count: number;
}

interface Viewer {
  id: number;
  nom_utilisateur: string;
  photo_url: string;
}

const ViewStory = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [showViewers, setShowViewers] = useState(false);
  const [viewers, setViewers] = useState<Viewer[]>([]);

  const fetchStory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "https://instaclone-oise.onrender.com/api/story/",
        { headers: { Authorization: `Token ${token}` } }
      );
      const s = res.data.find((st: Story) => st.id === Number(id));
      setStory(s);

      // Marquer comme vue
      await axios.post(
        `https://instaclone-oise.onrender.com/api/story/${id}/view/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (err) {
      console.error("Erreur chargement story", err);
    }
  };

  const toggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token || !story) return;

    try {
      const res = await axios.post(
        `https://instaclone-oise.onrender.com/api/story/${story.id}/like/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setStory({ ...story, ...res.data });
    } catch (err) {
      console.error("Erreur like", err);
    }
  };

  const fetchViewers = async () => {
    const token = localStorage.getItem("token");
    if (!token || !story) return;

    try {
      const res = await axios.get(
        `https://instaclone-oise.onrender.com/api/story/${story.id}/viewers/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setViewers(res.data);
      setShowViewers(true);
    } catch (err) {
      console.error("Erreur chargement viewers", err);
    }
  };

  useEffect(() => {
    fetchStory();
  }, []);

  if (!story) return <div className="text-white">Chargement...</div>;

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img src={story.user_photo} alt="" className="w-10 h-10 rounded-full" />
        <span>{story.user_nom_utilisateur}</span>
      </div>

      {/* Image ou texte */}
      {story.image_url ? (
        <img src={story.image_url} alt="" className="max-h-[70vh] rounded-lg" />
      ) : (
        <p className="text-lg">{story.text}</p>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-4 mt-6">
        <button onClick={toggleLike} className="flex items-center space-x-1">
          <Heart
            className={`w-6 h-6 ${
              story.liked_by_me ? "text-red-500" : "text-white"
            }`}
          />
          <span>{story.likes_count}</span>
        </button>
        <button
          onClick={fetchViewers}
          className="text-sm text-gray-300 underline"
        >
          {story.views_count} vues
        </button>
      </div>

      {/* Modal Viewers */}
      {showViewers && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-4 w-80 relative">
            <button
              onClick={() => setShowViewers(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Vues</h3>
            <div className="space-y-3">
              {viewers.length > 0 ? (
                viewers.map((v) => (
                  <div key={v.id} className="flex items-center space-x-3">
                    <img
                      src={v.photo_url || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{v.nom_utilisateur}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Aucune vue</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStory;
