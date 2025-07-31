from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from django.conf import settings
from django.db import models

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
        return user

    def create_superuser(self, email, nom_utilisateur, password):
        user = self.create_user(email, nom_utilisateur, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nom_utilisateur = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=False)  # ← Désactivé par défaut
    is_staff = models.BooleanField(default=False)
    confirmation_code = models.CharField(
        max_length=6, null=True, blank=True
    )  # ← Ajout ici

    USERNAME_FIELD = "nom_utilisateur"
    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email
