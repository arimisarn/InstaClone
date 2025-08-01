from rest_framework import serializers
from .models import CustomUser, Profile
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()
from .utils import generate_confirmation_code, send_confirmation_email
from rest_framework.validators import UniqueValidator

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="Cet email est déjà utilisé."
            )
        ],
    )
    nom_utilisateur = serializers.CharField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Ce nom d'utilisateur est déjà pris.",
            )
        ],
    )

    class Meta:
        model = User
        fields = ["email", "nom_utilisateur", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        validated_data.pop("password2")

        # Générer un code de confirmation
        code = generate_confirmation_code()

        user = User.objects.create_user(
            email=validated_data["email"],
            nom_utilisateur=validated_data["nom_utilisateur"],
            password=validated_data["password"],
        )

        user.is_active = False
        user.confirmation_code = code
        user.save()

        # Envoyer email
        send_confirmation_email(user.email, code)

        return user


from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    nom_utilisateur = serializers.CharField(
        source="user.nom_utilisateur", read_only=True
    )
    email = serializers.EmailField(source="user.email", read_only=True)
    nb_publications = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "nom_utilisateur",
            "email",
            "photo_url",
            "bio",
            "nb_publications",
            "followers",
            "following",
            "genre",
            "sites_web",
            "afficher_suggestions",
            "is_following",
        ]
        extra_kwargs = {
            "bio": {"required": False, "allow_blank": True},
            "photo_url": {"required": False, "allow_blank": True},
        }

    def get_nb_publications(self, obj):
        return obj.posts_count()

    def get_followers(self, obj):
        # ✅ personnes qui suivent cet utilisateur
        return obj.followers.count()

    def get_following(self, obj):
        # ✅ personnes que cet utilisateur suit
        return Profile.objects.filter(followers=obj.user).count()

    def get_is_following(self, obj):
        request = self.context.get("request", None)
        if request and request.user.is_authenticated:
            # L’utilisateur connecté suit-il ce profil ?
            return obj.followers.filter(pk=request.user.pk).exists()
        return False


class SearchProfileSerializer(serializers.ModelSerializer):
    nom_utilisateur = serializers.CharField(source="user.nom_utilisateur")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Profile
        fields = ["id", "nom_utilisateur", "email", "photo_url"]


class ProfileMiniSerializer(serializers.ModelSerializer):
    nom_utilisateur = serializers.CharField(source="user.nom_utilisateur")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Profile
        fields = ["nom_utilisateur", "email", "photo_url", "bio"]
