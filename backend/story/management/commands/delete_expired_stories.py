from django.core.management.base import BaseCommand
from story.models import Story
from django.utils import timezone


class Command(BaseCommand):
    help = "Supprime les stories expirées (plus de 24h)"

    def handle(self, *args, **kwargs):
        expired = Story.objects.filter(expires_at__lte=timezone.now())
        count = expired.count()
        expired.delete()
        self.stdout.write(self.style.SUCCESS(f"{count} stories supprimées"))
