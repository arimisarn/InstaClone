import time
import traceback
from django.shortcuts import render
import supabase
from .serializers import ProfileSerializer, RegisterSerializer
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model, authenticate
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Profile

User = get_user_model()


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
        username = request.data.get("nom_utilisateur")  # 👈 On attend ce champ
        password = request.data.get("password")

        user = authenticate(
            request, username=username, password=password
        )  # 👈 Utilise "username"
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response(
            {"detail": "Nom d'utilisateur ou mot de passe incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )


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
            return Response(
                {"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND
            )

        if user.is_active:
            return Response({"message": "Compte déjà activé."})

        if user.confirmation_code == code:
            user.is_active = True
            user.confirmation_code = None
            user.save()

            # 👇 AJOUT : Générer le token automatiquement après confirmation
            token, created = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "message": "Email confirmé avec succès.",
                    "token": token.key,  # 👈 Token pour connexion automatique
                    "user": {
                        "email": user.email,
                        "nom_utilisateur": user.nom_utilisateur,
                    },
                }
            )
        else:
            return Response(
                {"error": "Code incorrect."}, status=status.HTTP_400_BAD_REQUEST
            )
from supabase import create_client
from django.conf import settings
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
def clean_filename(name):
    return "".join(c for c in name if c.isalnum() or c in (" ", ".", "_")).rstrip()

from rest_framework.parsers import MultiPartParser, FormParser
class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def put(self, request, *args, **kwargs):
        profile = self.get_object()

        bio = request.data.get("bio", profile.bio)
        sexe = request.data.get("sexe", profile.sexe)
        site_web = request.data.getlist("site_web[]", profile.site_web)
        show_suggestions = request.data.get(
            "show_account_suggestions", profile.show_account_suggestions
        )
        photo_file = request.FILES.get("photo")

        photo_url = profile.photo_url

        try:
            if photo_file:
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

            # Mise à jour du profil
            profile.bio = bio
            profile.sexe = sexe
            profile.site_web = site_web
            profile.show_account_suggestions = show_suggestions
            profile.photo_url = photo_url
            profile.save()

            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=200)

        except Exception as e:
            traceback.print_exc()
            return Response({"detail": f"Erreur serveur : {str(e)}"}, status=500)
    @api_view(["GET"])
    @permission_classes([IsAuthenticated])
    def get_my_profile(request):
        try:
            profile, _ = Profile.objects.get_or_create(user=request.user)
            serializer = ProfileSerializer(profile, context={"request": request})
            return Response(serializer.data)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

# @api_view(["GET", "PATCH"])
# @permission_classes([IsAuthenticated])
# def get_my_profile(request):
#     profile, created = Profile.objects.get_or_create(user=request.user)

#     if request.method == "PATCH":
#         serializer = ProfileSerializer(profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)

#     serializer = ProfileSerializer(profile)
#     return Response(serializer.data)
