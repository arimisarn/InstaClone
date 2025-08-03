from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, send_message_to_user
from django.urls import path

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")

urlpatterns = [
    path("send_message_to_user/", send_message_to_user, name="send_message_to_user"),
]

urlpatterns += router.urls
