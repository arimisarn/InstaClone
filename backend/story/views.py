import time
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Story, StoryView
from .serializers import StorySerializer, StoryViewSerializer, StoryViewerSerializer
from .supabase_client import supabase
# from coaching_backend.utils import clean_filename


class StoryListView(generics.ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(expires_at__gt=timezone.now())


class StoryCreateView(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        text = request.data.get("text", "").strip() or None
        image_file = request.FILES.get("image")
        image_url = None

        if not text and not image_file:
            return Response({"error": "Story vide"}, status=400)

        if image_file:
            timestamp = int(time.time())
            safe_name = clean_filename(image_file.name)
            file_name = f"stories/{request.user.id}_{timestamp}_{safe_name}"
            supabase.storage.from_("avatar").upload(
                file_name, image_file.read(), {"content-type": image_file.content_type}
            )
            image_url = supabase.storage.from_("avatar").get_public_url(file_name)

        story = Story.objects.create(user=request.user, text=text, image_url=image_url)
        return Response(StorySerializer(story, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def toggle_like_story(request, pk):
    try:
        story = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        return Response({"error": "Introuvable"}, status=404)

    if request.user in story.likes.all():
        story.likes.remove(request.user)
    else:
        story.likes.add(request.user)

    return Response(
        {
            "likes_count": story.likes.count(),
            "liked_by_me": request.user in story.likes.all(),
        }
    )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def mark_story_viewed(request, pk):
    try:
        story = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        return Response({"error": "Introuvable"}, status=404)

    StoryView.objects.get_or_create(story=story, viewer=request.user)
    return Response({"views_count": story.views.count()})


class StoryViewersList(generics.ListAPIView):
    serializer_class = StoryViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StoryView.objects.filter(story_id=self.kwargs["pk"])

from rest_framework.permissions import IsAuthenticated
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def story_viewers(request, pk):
    try:
        story = Story.objects.get(pk=pk, user=request.user)
    except Story.DoesNotExist:
        return Response({"error": "Story introuvable ou pas la vôtre"}, status=404)

    viewers = story.views.all()  # ManyToManyField vers User
    serializer = StoryViewerSerializer(viewers, many=True)
    return Response(serializer.data)
