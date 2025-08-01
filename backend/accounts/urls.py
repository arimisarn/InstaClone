from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import ObtainAuthToken

from .views import (
    ConfirmEmailView,
    RegisterView,
    ProfileUpdateView,
    SearchUsersView,
    follow_user,
    get_my_profile,
    get_user_profile,
    list_followers,
    list_following,
    search_users,
    unfollow_user,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", ObtainAuthToken.as_view(), name="api-login"),
    path("confirm-email/", ConfirmEmailView.as_view(), name="verify-email"),
    path("profile-update/", ProfileUpdateView.as_view(), name="update_profile"),
    path("profile/", get_my_profile, name="get_my_profile"),
    path("search-users/", SearchUsersView.as_view(), name="search-users"),
    path("users/<str:username>/", get_user_profile),
    path("follow/<str:username>/", follow_user),
    path("unfollow/<str:username>/", unfollow_user),
    path("users/<str:username>/followers/", list_followers, name="list-followers"),
    path("users/<str:username>/following/", list_following, name="list-following"),
]
