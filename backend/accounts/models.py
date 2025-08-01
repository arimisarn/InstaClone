from django.db import models
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom_utilisateur, password=None):
        if not email:
            raise ValueError("L'utilisateur doit avoir un email")
        if not nom_utilisateur:
            raise ValueError("L'utilisateur doit avoir un nom d'utilisateur")

        email = self.normalize_email(email)
        user = self.model(email=email, nom_utilisateur=nom_utilisateur)
        user.set_password(password)
        user.save(using=self._db)
        Profile.objects.create(user=user)  # Crée un profil par défaut
        return user

    def create_superuser(self, email, nom_utilisateur, password):
        user = self.create_user(email, nom_utilisateur, password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nom_utilisateur = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    confirmation_code = models.CharField(max_length=6, null=True, blank=True)

    USERNAME_FIELD = "nom_utilisateur"
    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.nom_utilisateur

from django.contrib.postgres.fields import ArrayField
class Profile(models.Model):
    GENRE_CHOICES = [
        ("", "Je préfère ne pas répondre"),
        ("homme", "Homme"),
        ("femme", "Femme"),
        ("autre", "Autre"),
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    photo_url = models.URLField(blank=True, null=True)
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, blank=True, default="")
    sites_web = ArrayField(models.URLField(), blank=True, default=list)
    afficher_suggestions = models.BooleanField(default=True)
    bio = models.TextField(blank=True, default="")
    followers = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="following", blank=True
    )
    created_at = models.DateTimeField(default=timezone.now)

    def posts_count(self):
        return self.user.posts.count() if hasattr(self.user, "posts") else 0

    def following_count(self):
        # Combien de profils cet utilisateur suit ?
        return self.user.following.count() if hasattr(self.user, "following") else 0

    def followers_count(self):
        # Combien de profils suivent cet utilisateur (followers)
        return self.followers.count()


    def __str__(self):
        return f"Profil de {self.user.nom_utilisateur}"
