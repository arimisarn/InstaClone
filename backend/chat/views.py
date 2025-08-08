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


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from accounts.models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message_to_user(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response(
            {"error": "Conversation not trouvée."}, status=status.HTTP_404_NOT_FOUND
        )

    user = request.user
    if user not in conversation.participants.all():
        return Response(
            {"error": "Vous ne participez pas à cette conversation."},
            status=status.HTTP_403_FORBIDDEN,
        )

    message_text = request.data.get("message")
    if not message_text:
        return Response({"error": "Message vide."}, status=status.HTTP_400_BAD_REQUEST)

    message = Message.objects.create(
        conversation=conversation, sender=user, message=message_text
    )

    # Récupérer le profil de l'expéditeur
    try:
        profile = Profile.objects.get(user=user)
        user_photo = profile.photo.url if profile.photo else None
    except Profile.DoesNotExist:
        user_photo = None

    response_data = {
        "id": message.id,
        "conversation": conversation.id,
        "sender_id": user.id,
        "sender_nom_utilisateur": user.nom_utilisateur,
        "sender_photo": user_photo,
        "message": message.message,
        "timestamp": message.timestamp,
    }

    return Response(response_data, status=status.HTTP_201_CREATED)


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
