from rest_framework import serializers
from .models import Story


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ["id", "user", "image_url", "caption", "created_at", "expires_at"]
        read_only_fields = ["user", "image_url", "created_at", "expires_at"]
