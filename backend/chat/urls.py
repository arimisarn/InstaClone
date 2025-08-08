from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ConversationViewSet, search_user, send_message_to_user

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")

urlpatterns = [
    path(
        "conversations/<int:conversation_id>/send_message_to_user/",
        send_message_to_user,
        name="send_message_to_user",
    ),
    path("search_user/", search_user, name="search_user"),
]

urlpatterns += router.urls
