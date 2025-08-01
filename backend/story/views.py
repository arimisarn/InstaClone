import time
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Story, StoryView
from .serializers import StorySerializer, StoryViewSerializer, StoryViewerSerializer
from .supabase_client import supabase


class StoryListView(generics.ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(expires_at__gt=timezone.now()).order_by(
            "-created_at"
        )


class StoryCreateView(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        text = request.data.get("text", "").strip() or None
        image_file = request.FILES.get("image")
        image_url = None

        if not text and not image_file:
            return Response({"error": "Story vide"}, status=status.HTTP_400_BAD_REQUEST)

        if image_file:
            try:
                timestamp = int(time.time())
                safe_name = image_file.name.replace(" ", "_")
                file_name = f"stories/{request.user.id}_{timestamp}_{safe_name}"

                # Upload vers Supabase
                upload_res = supabase.storage.from_("avatar").upload(
                    file_name,
                    image_file.read(),
                    {"content-type": image_file.content_type},
                )

                if upload_res.get("error"):
                    return Response(
                        {
                            "error": f"Erreur upload Supabase: {upload_res['error']['message']}"
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                # Récupération URL publique
                image_url = supabase.storage.from_("avatar").get_public_url(file_name)

            except Exception as e:
                return Response(
                    {"error": f"Erreur upload image : {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        # Création en base
        story = Story.objects.create(user=request.user, text=text, image_url=image_url)

        return Response(
            StorySerializer(story, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def toggle_like_story(request, pk):
    try:
        story = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        return Response({"error": "Introuvable"}, status=status.HTTP_404_NOT_FOUND)

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
        return Response({"error": "Introuvable"}, status=status.HTTP_404_NOT_FOUND)

    StoryView.objects.get_or_create(story=story, viewer=request.user)
    return Response({"views_count": story.views.count()})


class StoryViewersList(generics.ListAPIView):
    serializer_class = StoryViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StoryView.objects.filter(story_id=self.kwargs["pk"])


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def story_viewers(request, pk):
    try:
        story = Story.objects.get(pk=pk, user=request.user)
    except Story.DoesNotExist:
        return Response(
            {"error": "Story introuvable ou pas la vôtre"},
            status=status.HTTP_404_NOT_FOUND,
        )

    viewers = story.views.all()
    serializer = StoryViewerSerializer(viewers, many=True)
    return Response(serializer.data)
