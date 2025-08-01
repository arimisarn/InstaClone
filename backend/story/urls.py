from django.urls import path
from .views import (
    StoryListView,
    StoryCreateView,
    toggle_like_story,
    mark_story_viewed,
    StoryViewersList,
    story_viewers,
)

urlpatterns = [
    path("", StoryListView.as_view(), name="story-list"),
    path("create/", StoryCreateView.as_view(), name="story-create"),
    path("<int:pk>/like/", toggle_like_story, name="story-toggle-like"),
    path("<int:pk>/view/", mark_story_viewed, name="story-mark-viewed"),
    path("<int:pk>/viewers/", StoryViewersList.as_view(), name="story-viewers-list"),
    path("story/<int:pk>/viewers/", story_viewers, name="story-viewers-detail"),
]
