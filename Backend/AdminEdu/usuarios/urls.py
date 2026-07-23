from django.urls import path, include
from rest_framework.routers import DefaultRouter
from usuarios.views.google_auth_view import GoogleAuthView

from .views import (
    LoginView,
    UserViewSet,
    GroupViewSet,
    MeView,
)

from .views_oauth import google_login

router = DefaultRouter()

router.register(
    r"usuarios",
    UserViewSet,
    basename="user",
)

router.register(
    r"grupos",
    GroupViewSet,
    basename="group",
)

urlpatterns = [

    path(
        "login",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "",
        include(router.urls),
    ),

    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),

    path(
    "auth/google/",
    google_login,
    name="google_login",
    ),

    path(
    "auth/google/login/",
    GoogleAuthView.login,
    name="google-login",
    ),

]

