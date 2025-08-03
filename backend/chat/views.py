from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from .utils_supabase import upload_image


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        text = request.data.get("text", "")
        image_file = request.FILES.get("image")

        image_url = None
        if image_file:
            image_url = upload_image(
                image_file, filename_prefix=f"user_{request.user.id}"
            )

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            text=text,
            image_url=image_url,
        )

        return Response(MessageSerializer(message).data)
