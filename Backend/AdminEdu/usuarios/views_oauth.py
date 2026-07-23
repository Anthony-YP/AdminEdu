from django.conf import settings
from django.shortcuts import redirect

from .services.google.google_auth_service import GoogleAuthService
from .services.google.google_user_service import GoogleUserService
from .services.auth.jwt_service import JWTService


def google_callback(request):
    """
    Callback ejecutado después de una autenticación
    exitosa con Google.

    Si el usuario ya existe, genera JWT y redirige.
    Si es nuevo (aspirante), lo crea automáticamente.
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

    if not GoogleAuthService.is_active(usuario):
        return redirect(
            f"{settings.FRONTEND_URL}/login?oauth_error=user_disabled"
        )

    tokens = JWTService.generate_tokens(usuario)

    return redirect(
        f"{settings.FRONTEND_URL}/oauth-callback"
        f"?access={tokens['access']}"
        f"&refresh={tokens['refresh']}"
    )


def google_login(request):
    return redirect("/accounts/google/login/?process=login")