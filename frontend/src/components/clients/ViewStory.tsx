import { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  Volume2,
  Play,
  MoreHorizontal,
  Grid3x3,
  MessageCircle,
  Bell,
  Heart,
} from "lucide-react";

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
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [showViewers, setShowViewers] = useState(false);

  const fetchStories = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "https://instaclone-oise.onrender.com/api/story/",
        { headers: { Authorization: `Token ${token}` } }
      );
      setStories(res.data);
      if (res.data.length > 0) {
        selectStory(res.data[0]); // par défaut première story
      }
    } catch (err) {
      console.error("Erreur chargement stories", err);
    }
  };

  const selectStory = async (story: Story) => {
    setSelectedStory(story);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `https://instaclone-oise.onrender.com/api/story/${story.id}/view/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (err) {
      console.error("Erreur marquage vue", err);
    }
  };

  const toggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedStory) return;

    try {
      const res = await axios.post(
        `https://instaclone-oise.onrender.com/api/story/${selectedStory.id}/like/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setSelectedStory({ ...selectedStory, ...res.data });
      setStories((prev) =>
        prev.map((s) => (s.id === selectedStory.id ? { ...s, ...res.data } : s))
      );
    } catch (err) {
      console.error("Erreur like", err);
    }
  };

  const fetchViewers = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedStory) return;

    try {
      const res = await axios.get(
        `https://instaclone-oise.onrender.com/api/story/${selectedStory.id}/viewers/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setViewers(res.data);
      setShowViewers(true);
    } catch (err) {
      console.error("Erreur chargement viewers", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <X className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">f</span>
            </div>
          </div>
        </div>

        {/* Stories */}
        <div className="px-4 flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Toutes les stories</h2>
          <div className="space-y-1">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => selectStory(story)}
              >
                <div className="relative">
                  <div className="p-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <img
                      src={story.user_photo || "/default-avatar.png"}
                      alt={story.user_nom_utilisateur}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-900"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {story.user_nom_utilisateur}
                  </p>
                  <p className="text-xs text-gray-400">
                    {story.views_count} vues
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Story Viewer */}
      <div className="flex-1 relative">
        {selectedStory ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStory.user_photo || "/default-avatar.png"}
                  alt={selectedStory.user_nom_utilisateur}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="font-semibold text-white">
                    {selectedStory.user_nom_utilisateur}
                  </p>
                  <p className="text-sm text-white/80">Story</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Volume2 className="w-6 h-6 text-white cursor-pointer" />
                <Play className="w-6 h-6 text-white cursor-pointer" />
                <MoreHorizontal className="w-6 h-6 text-white cursor-pointer" />
              </div>
            </div>

            {/* Story Content */}
            {selectedStory.image_url ? (
              <img
                src={selectedStory.image_url}
                alt=""
                className="max-h-[80vh] rounded-xl shadow-lg"
              />
            ) : (
              <p className="text-lg">{selectedStory.text}</p>
            )}

            {/* Actions */}
            <div className="absolute bottom-8 flex flex-col items-center space-y-4">
              <button
                onClick={toggleLike}
                className="flex items-center space-x-1"
              >
                <Heart
                  className={`w-6 h-6 ${
                    selectedStory.liked_by_me ? "text-red-500" : "text-white"
                  }`}
                />
                <span>{selectedStory.likes_count}</span>
              </button>
              <button
                onClick={fetchViewers}
                className="text-sm text-gray-300 underline"
              >
                {selectedStory.views_count} vues
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sélectionnez une story
          </div>
        )}

        {/* Top Right Icons */}
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <Grid3x3 className="w-6 h-6 text-white cursor-pointer" />
          <MessageCircle className="w-6 h-6 text-white cursor-pointer" />
          <Bell className="w-6 h-6 text-white cursor-pointer" />
        </div>
      </div>

      {/* Viewers Modal */}
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
                      alt={v.nom_utilisateur}
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
