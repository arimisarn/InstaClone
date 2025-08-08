import traceback
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, UserSerializer
from accounts.models import CustomUser, Profile

User = get_user_model()


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        try:
            conversation = self.get_object()

            if request.user not in conversation.participants.all():
                return Response(
                    {"detail": "Non autorisé"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            text = request.data.get("text", "").strip()
            image_url = request.data.get("image_url")

            if not text and not image_url:
                return Response(
                    {"error": "Message vide"},
                    status=status.HTTP_400_BAD_REQUEST,
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
            traceback.print_exc()
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message_to_user(request, conversation_id):
    try:
        print(f"📨 Envoi message à la conversation {conversation_id}")
        conversation = Conversation.objects.get(id=conversation_id)

        user = request.user
        if user not in conversation.participants.all():
            return Response(
                {"error": "Vous ne participez pas à cette conversation."},
                status=status.HTTP_403_FORBIDDEN,
            )

        text = request.data.get("text", "").strip()
        if not text:
            return Response(
                {"error": "Message vide."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        message = Message.objects.create(
            conversation=conversation, sender=user, text=text
        )

        try:
            profile = Profile.objects.get(user=user)
            photo_url = profile.photo_url if profile.photo_url else None
        except Profile.DoesNotExist:
            photo_url = None

        response_data = {
            "id": message.id,
            "conversation": conversation.id,
            "sender_id": user.id,
            "sender_nom_utilisateur": user.nom_utilisateur,
            "sender_photo": photo_url,
            "text": message.text,
            "timestamp": message.created_at,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    except Conversation.DoesNotExist:
        return Response(
            {"error": "Conversation non trouvée."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        traceback.print_exc()
        return Response(
            {
                "error": "Erreur serveur",
                "details": str(e),
                "trace": traceback.format_exc(),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


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
            photo_url = (
                getattr(user.profile, "photo_url", None)
                if hasattr(user, "profile")
                else None
            )

            results.append(
                {
                    "id": user.id,
                    "nom_utilisateur": user.nom_utilisateur,
                    "photo": photo_url,
                }
            )

        return Response({"users": results})

    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
