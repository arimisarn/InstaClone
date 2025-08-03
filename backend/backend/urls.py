from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({"status": "ok", "message": "🎯 Backend OK"})


urlpatterns = [
    path("", health_check),
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/story/", include("story.urls")),
    path("api/chat/", include("chat.urls")),  # ✅ Avec le / final
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
