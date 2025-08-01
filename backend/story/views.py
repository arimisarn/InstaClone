import time
import json
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Story
from .serializers import StorySerializer

from .supabase_client import (
    supabase,
)


def clean_filename(name):
    # Pour sécuriser le nom du fichier
    import re

    return re.sub(r"[^a-zA-Z0-9_.-]", "_", name)


class StoryCreateView(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        user = request.user
        caption = request.data.get("caption", "")

        photo_file = request.FILES.get("image")
        if not photo_file:
            return Response({"detail": "Image manquante"}, status=400)

        timestamp = int(time.time())
        safe_name = clean_filename(photo_file.name)
        file_name = f"{user.id}_story_{timestamp}_{safe_name}"

        try:
            supabase.storage.from_("avatar").upload(
                file_name,
                photo_file.read(),
                {"content-type": photo_file.content_type},
            )
        except Exception as e:
            if "Duplicate" in str(e):
                supabase.storage.from_("avatar").remove([file_name])
                supabase.storage.from_("avatar").upload(
                    file_name,
                    photo_file.read(),
                    {"content-type": photo_file.content_type},
                )
            else:
                return Response({"detail": f"Erreur upload: {str(e)}"}, status=500)

        image_url = supabase.storage.from_("avatar").get_public_url(file_name)

        story = Story.objects.create(
            user=user,
            image_url=image_url,
            caption=caption,
        )
        serializer = self.get_serializer(story)
        return Response(serializer.data, status=201)
