from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import login
from django.contrib.auth.models import Group

from .models import GRUPO_ESTUDIANTE
from .services.google.google_auth_service import GoogleAuthService
from .services.google.google_user_service import GoogleUserService
from .services.auth.jwt_service import JWTService


def google_callback_process(request):
    """
    Endpoint intermedio que recibe el callback de allauth
    después del login con Google. Genera JWT y redirige
    al frontend con los tokens.
    """
    if not request.user.is_authenticated:
        return redirect(
            f"{settings.FRONTEND_URL}/login?oauth_error=not_authenticated"
        )

    email = request.user.email

    if not email:
        return redirect(
            f"{settings.FRONTEND_URL}/login?oauth_error=no_email"
        )

    usuario = GoogleAuthService.get_user_by_email(email)

    if usuario is None:
        first_name = getattr(request.user, "first_name", "") or ""
        last_name = getattr(request.user, "last_name", "") or ""

        if not first_name and not last_name:
            display = getattr(request.user, "get_full_name", lambda: "")()
            if display:
                parts = display.split(" ", 1)
                first_name = parts[0]
                last_name = parts[1] if len(parts) > 1 else ""

        usuario = GoogleUserService.get_or_create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

    if not usuario.groups.exists():
        estudiante_group, _ = Group.objects.get_or_create(
            name=GRUPO_ESTUDIANTE
        )
        usuario.groups.add(estudiante_group)

    if not GoogleAuthService.is_active(usuario):
        return redirect(
            f"{settings.FRONTEND_URL}/login?oauth_error=user_disabled"
        )

    login(request, usuario, backend="allauth.account.auth_backends.AuthenticationBackend")

    tokens = JWTService.generate_tokens(usuario)

    return redirect(
        f"{settings.FRONTEND_URL}/oauth-callback"
        f"?access={tokens['access']}"
        f"&refresh={tokens['refresh']}"
    )


def google_login(request):
    return redirect("/accounts/google/login/?process=login")
