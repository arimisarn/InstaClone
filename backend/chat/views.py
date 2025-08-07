from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, UserSerializer
from accounts.models import CustomUser


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    @action(detail=True, methods=["post"], url_path="send_message_to_user")
    def send_message_to_user(self, request, pk=None):
        conversation = self.get_object()
        sender = request.user
        message_text = request.data.get("message")

        if not message_text:
            return Response(
                {"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        message = Message.objects.create(
            conversation=conversation, sender=sender, message=message_text
        )
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        try:
            conversation = self.get_object()

            # Vérifier que l'utilisateur est bien dans la conversation
            if request.user not in conversation.participants.all():
                return Response(
                    {"detail": "Non autorisé"}, status=status.HTTP_403_FORBIDDEN
                )

            text = request.data.get("text", "").strip()
            image_url = request.data.get("image_url", None)

            if not text and not image_url:
                return Response(
                    {"error": "Message vide"}, status=status.HTTP_400_BAD_REQUEST
                )

            message = Message.objects.create(
                conversation=conversation,
                sender=request.user,
                text=text if text else None,
                image_url=image_url,
            )

            serializer = MessageSerializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message_to_user(request):
    try:
        recipient_id = request.data.get("recipient_id")
        text = request.data.get("text", "").strip()
        image_url = request.data.get("image_url", None)

        if not recipient_id:
            return Response({"error": "recipient_id est requis"}, status=400)

        recipient = get_object_or_404(CustomUser, id=recipient_id)

        # Cherche une conversation existante
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
            conversation=conversation,
            sender=request.user,
            text=text if text else None,
            image_url=image_url,
        )

        return Response(
            {
                "success": True,
                "conversation_id": conversation.id,
                "message": MessageSerializer(message).data,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_user(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response({"users": []})

    try:
        users = CustomUser.objects.filter(nom_utilisateur__icontains=query)[:10]
        results = []
        for user in users:
            # Récupérer la photo depuis le profil lié (peut être None)
            photo_url = None
            if hasattr(user, "profile") and user.profile:
                photo_url = user.profile.photo_url

            results.append(
                {
                    "id": user.id,
                    "nom_utilisateur": user.nom_utilisateur,
                    "photo": photo_url,
                }
            )
        return Response({"users": results})

    except Exception as e:
        import traceback

        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
