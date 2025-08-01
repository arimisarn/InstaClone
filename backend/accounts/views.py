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

from .serializers import ProfileSerializer, RegisterSerializer
from .models import Profile
from .supabase_client import supabase  # ✅ Nouvelle importation

User = get_user_model()


def clean_filename(name):
    return "".join(c for c in name if c.isalnum() or c in (" ", ".", "_")).rstrip()


# ----------------------------
# 📌 INSCRIPTION
# ----------------------------
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


# ----------------------------
# 📌 CONNEXION
# ----------------------------
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

        # 🔍 Debug : voir ce que reçoit le backend
        print("📌 DATA REÇUE :", dict(request.data))
        print("📌 FILES REÇUS :", request.FILES)

        try:
            # ✅ Récupération des champs simples
            bio = request.data.get("bio", profile.bio)
            genre = request.data.get("genre", profile.genre)
            show_suggestions = request.data.get(
                "afficher_suggestions", profile.afficher_suggestions
            )

            # ✅ Récupération des sites web
            site_web = profile.site_web
            if "site_web" in request.data:
                try:
                    site_web = json.loads(request.data.get("site_web"))
                    if not isinstance(site_web, list):
                        site_web = [str(site_web)]
                except Exception:
                    site_web = [request.data.get("site_web")]
            elif "site_web[]" in request.data:
                site_web = request.data.getlist("site_web[]")

            # ✅ Gestion de la photo
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

                # URL publique
                photo_url = supabase.storage.from_("avatar").get_public_url(file_name)

            # ✅ Sauvegarde profil
            profile.bio = bio
            profile.genre = genre
            profile.site_web = site_web
            profile.afficher_suggestions = show_suggestions
            profile.photo_url = photo_url
            profile.save()

            return Response(self.get_serializer(profile).data, status=200)

        except Exception as e:
            import traceback

            traceback.print_exc()
            return Response({"detail": f"Erreur serveur : {str(e)}"}, status=500)


# ----------------------------
# 📌 RÉCUPÉRER MON PROFIL
# ----------------------------
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
