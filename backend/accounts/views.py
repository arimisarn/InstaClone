import json
import profile
import time
import traceback
from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
from httpx import request
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    ProfileMiniSerializer,
    ProfileSerializer,
    RegisterSerializer,
    SearchProfileSerializer,
)
from .models import Profile
from .supabase_client import supabase

User = get_user_model()


def clean_filename(name):
    return "".join(c for c in name if c.isalnum() or c in (" ", ".", "_")).rstrip()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Inscription réussie. Un code de confirmation a été envoyé à votre email.",
                "email": user.email,
                "nom_utilisateur": user.nom_utilisateur,
                "token": token.key,
            },
            status=201,
        )


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("nom_utilisateur")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response(
            {"detail": "Nom d'utilisateur ou mot de passe incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ----------------------------
# 📌 CONFIRMATION EMAIL
# ----------------------------
class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        if not email or not code:
            return Response(
                {"error": "Email et code sont requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=404)

        if user.is_active:
            return Response({"message": "Compte déjà activé."})

        if user.confirmation_code == code:
            user.is_active = True
            user.confirmation_code = None
            user.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "message": "Email confirmé avec succès.",
                    "token": token.key,
                    "user": {
                        "email": user.email,
                        "nom_utilisateur": user.nom_utilisateur,
                    },
                }
            )
        else:
            return Response({"error": "Code incorrect."}, status=400)


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def put(self, request, *args, **kwargs):
        profile = self.get_object()

        print("📌 DATA REÇUE :", dict(request.data))
        print("📌 FILES REÇUS :", request.FILES)

        try:
            # Bio et genre
            bio = request.data.get("bio", profile.bio)
            genre = request.data.get("genre", profile.genre)

            # ✅ Conversion en booléen
            show_suggestions = request.data.get(
                "afficher_suggestions", profile.afficher_suggestions
            )
            if isinstance(show_suggestions, list):
                show_suggestions = show_suggestions[0]
            if isinstance(show_suggestions, str):
                show_suggestions = show_suggestions.lower() in ["true", "1", "yes"]

            # ✅ Gestion des sites web
            sites_web = profile.sites_web
            if "sites_web" in request.data:
                try:
                    sites_web = json.loads(request.data.get("sites_web"))
                    if not isinstance(sites_web, list):
                        sites_web = [str(sites_web)]
                except Exception:
                    sites_web = [request.data.get("sites_web")]
            elif "sites_web[]" in request.data:
                sites_web = request.data.getlist("sites_web[]")

            # ✅ Upload photo vers Supabase
            photo_file = request.FILES.get("photo")
            photo_url = profile.photo_url

            if photo_file:
                if not supabase:
                    raise Exception("Supabase n'est pas configuré.")

                timestamp = int(time.time())
                safe_name = clean_filename(photo_file.name)
                file_name = f"{request.user.id}_{timestamp}_{safe_name}"

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
                        raise e

                photo_url = supabase.storage.from_("avatar").get_public_url(file_name)

            # ✅ Mise à jour du profil
            profile.bio = bio
            profile.genre = genre
            profile.sites_web = sites_web  # ✅ nom corrigé
            profile.afficher_suggestions = show_suggestions  # ✅ booléen
            profile.photo_url = photo_url
            profile.save()

            return Response(self.get_serializer(profile).data, status=200)

        except Exception as e:
            import traceback

            traceback.print_exc()
            return Response({"detail": f"Erreur serveur : {str(e)}"}, status=500)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    try:
        print("🔍 USER :", request.user)
        print("🔍 IS AUTHENTICATED :", request.user.is_authenticated)

        profile, _ = Profile.objects.get_or_create(user=request.user)
        print("🔍 PROFILE RÉCUPÉRÉ :", profile)

        if request.method == "PATCH":
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print("❌ ERREUR SERIALIZER :", serializer.errors)
            return Response(serializer.errors, status=400)

        serializer = ProfileSerializer(profile)
        print("✅ SERIALIZER DATA :", serializer.data)
        return Response(serializer.data)

    except Exception as e:
        import traceback

        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
    q = request.GET.get("q", "").strip()
    if not q:
        return Response([])
    users = User.objects.filter(nom_utilisateur__icontains=q)[:10]
    results = [
        {
            "user_id": u.id,
            "nom_utilisateur": u.nom_utilisateur,
            "photo_url": (
                u.profile.photo.url
                if hasattr(u, "profile") and u.profile.photo
                else None
            ),
        }
        for u in users
    ]
    return Response(results)


User = get_user_model()


class SearchUsersView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]  # ou AllowAny si tu veux public

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response([], status=200)

        # 🔍 Recherche insensible à la casse
        users = User.objects.filter(nom_utilisateur__icontains=query)[:10]

        results = []
        for user in users:
            try:
                profile = user.profile
                results.append(
                    {
                        "nom_utilisateur": user.nom_utilisateur,
                        "email": user.email,
                        "photo_url": profile.photo_url if profile.photo_url else None,
                    }
                )
            except Profile.DoesNotExist:
                results.append(
                    {
                        "nom_utilisateur": user.nom_utilisateur,
                        "email": user.email,
                        "photo_url": None,
                    }
                )

        return Response(results, status=200)


User = get_user_model()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request, username):
    user = get_object_or_404(User, nom_utilisateur=username)
    profile = getattr(user, "profile", None)

    photo_url = None
    if profile:
        # Attention si photo est un URLField, pas ImageField
        photo_url = profile.photo_url if hasattr(profile, "photo_url") else None

    return Response(
        {
            "nom_utilisateur": user.nom_utilisateur,
            "email": user.email,
            "photo_url": photo_url,
            "bio": profile.bio if profile else "",
            "nb_publications": user.posts.count() if hasattr(user, "posts") else 0,
            "followers": profile.followers.count() if profile else 0,
            "following": user.following.count() if hasattr(user, "following") else 0,
            "sites_web": profile.sites_web if profile and profile.sites_web else [],
            "is_following": (
                request.user in profile.followers.all()
                if profile and hasattr(profile, "followers")
                else False
            ),
        }
    )


from django.shortcuts import get_object_or_404


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    print("=== DEBUG FOLLOW ===")
    print("Username reçu :", username)
    print("Utilisateur connecté :", request.user.nom_utilisateur)

    user_to_follow = get_object_or_404(User, nom_utilisateur=username)
    profile_to_follow = get_object_or_404(Profile, user=user_to_follow)

    profile_to_follow.followers.add(request.user)
    profile_to_follow.save()

    return Response(
        {
            "detail": "Utilisateur suivi",
            "followers": profile_to_follow.followers.count(),
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unfollow_user(request, username):
    if request.user.nom_utilisateur == username:
        return Response(
            {"detail": "Vous ne pouvez pas vous désabonner de vous-même."}, status=400
        )

    user_to_unfollow = get_object_or_404(User, nom_utilisateur=username)
    profile_to_unfollow = get_object_or_404(Profile, user=user_to_unfollow)

    profile_to_unfollow.followers.remove(request.user)
    profile_to_unfollow.save()

    return Response({"detail": "Utilisateur non suivi"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_followers(request, username):
    profile = get_object_or_404(Profile, user__nom_utilisateur=username)
    followers_qs = profile.followers.all()  # liste d'utilisateurs
    profiles = Profile.objects.filter(user__in=followers_qs)
    serializer = ProfileMiniSerializer(profiles, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_following(request, username):
    profile = get_object_or_404(Profile, user__nom_utilisateur=username)
    following_qs = Profile.objects.filter(
        followers=profile.user
    )  # profils suivis par l'utilisateur
    serializer = ProfileMiniSerializer(following_qs, many=True)
    return Response(serializer.data)
