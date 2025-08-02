import { useEffect, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Story {
  id: number;
  user_id: number;
  user_nom_utilisateur: string;
  user_photo: string;
  image_url: string | null;
  text: string | null;
  liked_by_me: boolean;
  likes_count: number | null;
  views_count: number | null;
}

const StoryList = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();

  const currentUserId = Number(localStorage.getItem("user_id"));
  const currentUserPhoto =
    localStorage.getItem("user_photo") || "/default-avatar.png";

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get<Story[]>(
          "https://instaclone-oise.onrender.com/api/story/",
          { headers: { Authorization: `Token ${token}` } }
        );

        const myStory = res.data.find((s) => s.user_id === currentUserId);
        const otherStories = res.data.filter(
          (s) => s.user_id !== currentUserId
        );

        if (myStory) {
          setStories([myStory, ...otherStories]);
        } else {
          setStories(otherStories);
        }
      } catch (err) {
        console.error("Erreur chargement stories", err);
      }
    };

    fetchStories();
  }, [currentUserId]);

  return (
    <div className="bg-black text-white p-4">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {/* Créer story */}
        <div
          onClick={() => navigate("/story/create")}
          className="flex-shrink-0 cursor-pointer"
        >
          <div className="w-24 h-40 bg-gray-800 rounded-lg overflow-hidden relative">
            <div
              className="w-full h-3/4 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentUserPhoto})`,
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-2">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div className="h-1/4 bg-gray-800 flex items-center justify-center">
              <span className="text-xs text-center px-1 font-medium">
                Créer une story
              </span>
            </div>
          </div>
        </div>

        {/* Stories */}
        {stories.map((story) => {
          const isMyStory = story.user_id === currentUserId;

          return (
            <div
              key={story.id}
              onClick={() => navigate(`/story/view/${story.id}`)}
              className="flex-shrink-0 relative cursor-pointer"
            >
              <div className="w-24 h-40 rounded-lg overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${
                      story.image_url || "/default-story-bg.jpg"
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2">
                    <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                      <div
                        className="w-full h-full rounded-full bg-cover bg-center border-2 border-black"
                        style={{
                          backgroundImage: `url(${
                            story.user_photo || "/default-avatar.png"
                          })`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white text-xs font-medium drop-shadow-lg">
                      {isMyStory ? "Vous" : story.user_nom_utilisateur}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Next arrow */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryList;
