from django.shortcuts import render
from .serializers import RegisterSerializer
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model, authenticate
from rest_framework.permissions import AllowAny


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

