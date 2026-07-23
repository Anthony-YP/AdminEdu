from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoginView, UserViewSet, GroupViewSet
from .views_oauth import google_login
from .views_register import register

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
    "auth/google/",
    google_login,
    name="google_login",
    ),

    path(
        "register",
        register,
        name="register",
    ),

]

