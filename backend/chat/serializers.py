# chat/serializers.py
from rest_framework import serializers
from .models import Conversation, Message
from accounts.models import CustomUser, Profile
from accounts.serializers import (
    ProfileMiniSerializer,
)  # importe le serializer ProfileMini


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileMiniSerializer(
        source="profile", read_only=True
    )  # ajoute la relation profile

    class Meta:
        model = CustomUser
        fields = ["id", "nom_utilisateur", "profile"]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "text",
            "image_url",
            "reactions",
            "created_at",
        ]


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "participants", "messages", "created_at"]
