from django.shortcuts import render
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    try:
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)
    except Exception as e:
        import traceback

        traceback.print_exc()
        return Response({"error": "Erreur interne serveur."}, status=500)
