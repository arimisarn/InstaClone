from rest_framework import serializers

from accounts.models import CustomUser
from .models import Story, StoryView


class StorySerializer(serializers.ModelSerializer):
    user_nom_utilisateur = serializers.CharField(
        source="user.nom_utilisateur", read_only=True
    )
    user_photo = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            "id",
            "user_nom_utilisateur",
            "user_photo",
            "text",
            "image_url",
            "created_at",
            "expires_at",
            "likes_count",
            "liked_by_me",
            "views_count",
        ]

    def get_user_photo(self, obj):
        return obj.user.photo_url or "/default-avatar.png"

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_me(self, obj):
        user = self.context["request"].user
        return obj.likes.filter(id=user.id).exists()

    def get_views_count(self, obj):
        return obj.views.count()


class StoryViewSerializer(serializers.ModelSerializer):
    viewer_name = serializers.CharField(source="viewer.nom_utilisateur")
    viewer_photo = serializers.SerializerMethodField()

    class Meta:
        model = StoryView
        fields = ["viewer_name", "viewer_photo", "viewed_at"]

    def get_viewer_photo(self, obj):
        return obj.viewer.photo_url or "/default-avatar.png"



class StoryViewerSerializer(serializers.ModelSerializer):
    nom_utilisateur = serializers.CharField()
    photo_url = serializers.CharField(source="photo", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "nom_utilisateur", "photo_url"]