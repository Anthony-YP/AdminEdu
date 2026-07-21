# usuarios/views_oauth.py
from django.conf import settings
from django.shortcuts import redirect

from usuarios.services.google_auth_service import GoogleAuthService
from usuarios.services.jwt_service import JWTService

from django.shortcuts import redirect

def google_callback(request):
    """
    Callback ejecutado después de una autenticación
    exitosa con Google.

    Su única responsabilidad es coordinar el flujo
    entre Google, los servicios de autenticación
    y el frontend.
    """

    if not request.user.is_authenticated:
        return redirect(
            f"{settings.FRONTEND_URL}/login?oauth_error=not_authenticated"
        )

    usuario = GoogleAuthService.get_user_by_email(
        request.user.email
    )

    if usuario is None:
        return redirect(
            f"{settings.FRONTEND_URL}/login?oauth_error=not_registered"
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