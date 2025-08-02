from rest_framework import serializers
from accounts.models import CustomUser, Profile
from .models import Story, StoryView


class StorySerializer(serializers.ModelSerializer):
    user_nom_utilisateur = serializers.CharField(
        source="user.nom_utilisateur", read_only=True
    )
    user_photo = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = Story
        fields = [
            "id",
            "user_nom_utilisateur",
            "user_photo",
            "text",
            "user_id",
            "image_url",
            "created_at",
            "expires_at",
            "likes_count",
            "liked_by_me",
            "views_count",
        ]

    def get_user_photo(self, obj):
        try:
            return obj.user.profile.photo_url or "/default-avatar.png"
        except Exception:
            return "/default-avatar.png"

    def get_likes_count(self, obj):
        request = self.context.get("request")
        if obj.user == request.user:
            return obj.likes.count()  # ✅ On montre le nombre si c’est toi
        return None  # 🚫 On cache aux autres

    def get_liked_by_me(self, obj):
        request = self.context.get("request")
        # 🚫 Tu ne peux pas liker ta propre story
        if obj.user == request.user:
            return False
        return obj.likes.filter(id=request.user.id).exists()

    def get_views_count(self, obj):
        request = self.context.get("request")
        if obj.user == request.user:
            return obj.views.count()  # ✅ Montre seulement au propriétaire
        return None  # 🚫 Cache aux autres


# class StorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Story
#         fields = ["id", "text", "image_url", "created_at", "expires_at"]


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
    photo_url = serializers.CharField(source="photo_url", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "nom_utilisateur", "photo_url"]
