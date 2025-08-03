from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse(
        {"status": "ok", "message": "🎯 Le backend Django sur Render fonctionne !"}
    )


urlpatterns = [
    path("", health_check),
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/story/", include("story.urls")),
    path("api/", include("chat.urls")),  # Toutes les URLs chat sous /api/
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
