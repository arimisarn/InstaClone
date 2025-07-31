from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import ObtainAuthToken

from .views import ConfirmEmailView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", ObtainAuthToken.as_view(), name="api-login"),
    path("confirm-email/", ConfirmEmailView.as_view(), name="verify-email"),
]
