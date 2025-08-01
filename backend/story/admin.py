from django.contrib import admin
from .models import Story


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "expires_at", "likes_count")
    search_fields = ("user__nom_utilisateur",)
    list_filter = ("created_at",)

    def likes_count(self, obj):
        return obj.likes.count()
