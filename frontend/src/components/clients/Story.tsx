import { Plus, ChevronRight } from "lucide-react";

const Story = () => {
  const stories = [
    {
      id: 1,
      type: "create",
      title: "Créer une story",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b412?w=200&h=300&fit=crop&crop=face",
      hasStory: false,
    },
    {
      id: 2,
      name: "Michaëlla Andriamana...",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=300&fit=crop&crop=face",
      hasStory: true,
      viewed: false,
    },
    {
      id: 3,
      name: "Fitia Gs",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop&crop=face",
      hasStory: true,
      viewed: false,
    },
    {
      id: 4,
      name: "Milantsoa Ranja",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop&crop=face",
      hasStory: true,
      viewed: false,
    },
    {
      id: 5,
      name: "Rvins lanja",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&crop=face",
      hasStory: true,
      viewed: false,
    },
    {
      id: 6,
      name: "Hajaina Ratovonan",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=300&fit=crop&crop=face",
      hasStory: true,
      viewed: false,
    },
  ];

  return (
    <div className="bg-black text-white p-4">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 relative">
            {story.type === "create" ? (
              <div className="w-24 h-40 bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer">
                <div
                  className="w-full h-3/4 bg-cover bg-center"
                  style={{ backgroundImage: `url(${story.image})` }}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-2">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div className="h-1/4 bg-gray-800 flex items-center justify-center">
                  <span className="text-xs text-center px-1 font-medium">
                    {story.title}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-24 h-40 rounded-lg overflow-hidden relative cursor-pointer">
                <div
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${story.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Profile circle with story ring */}
                  <div className="absolute top-2 left-2">
                    <div
                      className={`w-8 h-8 rounded-full p-0.5 ${
                        story.viewed
                          ? "bg-gray-400"
                          : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full bg-cover bg-center border-2 border-black"
                        style={{ backgroundImage: `url(${story.image})` }}
                      />
                    </div>
                  </div>

                  {/* Name at bottom */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white text-xs font-medium drop-shadow-lg">
                      {story.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

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

export default Story;
