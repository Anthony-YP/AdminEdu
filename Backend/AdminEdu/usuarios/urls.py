from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from usuarios.views.google_auth_view import GoogleAuthView

from .views import (
    LoginView,
    LogoutView,
    UserViewSet,
    GroupViewSet,
    MeView,
)
from .views.password_reset_view import (
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

from .views_oauth import google_login, google_callback_process

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
        "logout",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),

    path(
        "password-reset/request/",
        PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),

    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
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

    path(
        "auth/google/callback-process/",
        google_callback_process,
        name="google-callback-process",
    ),

]

