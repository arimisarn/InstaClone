from django.urls import path
from .views import (
    StoryListView,
    StoryCreateView,
    story_viewers,
    toggle_like_story,
    mark_story_viewed,
    StoryViewersList,
)

urlpatterns = [
    path("", StoryListView.as_view()),
    path("create/", StoryCreateView.as_view()),
    path("<int:pk>/like/", toggle_like_story),
    path("<int:pk>/view/", mark_story_viewed),
    path("<int:pk>/viewers/", StoryViewersList.as_view()),
    path("story/<int:pk>/viewers/", story_viewers),
]
