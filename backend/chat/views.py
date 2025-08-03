from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Conversation

from .serializers import ConversationSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        conv = serializer.save()
        conv.participants.add(self.request.user)

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        if request.user not in conversation.participants.all():
            return Response(
                {"detail": "Non autorisé"}, status=status.HTTP_403_FORBIDDEN
            )

        text = request.data.get("text", "")
        image_url = request.data.get("image_url", None)

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            text=text if text else None,
            image_url=image_url,
        )
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from accounts.models import CustomUser

from rest_framework.decorators import api_view, permission_classes


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message_to_user(request):
    recipient_id = request.data.get("recipient_id")
    text = request.data.get("text")
    image_url = request.data.get("image_url")

    if not recipient_id:
        return Response({"error": "recipient_id est requis"}, status=400)

    recipient = get_object_or_404(CustomUser, id=recipient_id)

    # Vérifie si une conversation existe déjà entre les deux
    conversation = (
        Conversation.objects.filter(participants=request.user)
        .filter(participants=recipient)
        .first()
    )

    # Si pas de conversation → création
    if not conversation:
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, recipient)

    # Création du message
    message = Message.objects.create(
        conversation=conversation, sender=request.user, text=text, image_url=image_url
    )

    return Response(
        {"success": True, "conversation_id": conversation.id, "message_id": message.id},
        status=status.HTTP_201_CREATED,
    )
