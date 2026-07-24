from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from usuarios.models import Usuario

_token_generator = PasswordResetTokenGenerator()


class PasswordResetService:
    """
    RF02: recuperación de contraseña mediante número de identificación
    y correo electrónico.
    """

    @staticmethod
    def solicitar_reset(numero_identificacion, correo):
        """
        Si existe una Persona cuyo número de identificación y correo
        coinciden y tiene una cuenta de usuario asociada, le envía un
        enlace de restablecimiento. No revela si los datos existen o
        no en la respuesta (evita enumeración de usuarios) — el
        llamador siempre debe mostrar un mensaje genérico.
        """

        from gestion_academica.models.persona.Persona import Persona

        try:
            persona = Persona.objects.get(
                numero_identificacion=numero_identificacion,
                correo=correo,
            )
        except Persona.DoesNotExist:
            return

        usuario = persona.usuario

        if usuario is None or not usuario.is_active:
            return

        uid = urlsafe_base64_encode(force_bytes(usuario.pk))
        token = _token_generator.make_token(usuario)

        enlace = f"{settings.FRONTEND_URL}/restablecer-contrasena?uid={uid}&token={token}"

        send_mail(
            subject="Recuperación de contraseña - AdminEdu",
            message=(
                "Solicitaste restablecer tu contraseña.\n\n"
                f"Usa el siguiente enlace para continuar: {enlace}\n\n"
                "Si no fuiste tú, ignora este correo."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[correo],
        )

    @staticmethod
    def confirmar_reset(uidb64, token, nueva_password):

        from django.core.exceptions import ValidationError
        from django.contrib.auth.password_validation import validate_password

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            usuario = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            raise ValidationError("El enlace de restablecimiento no es válido.")

        if not _token_generator.check_token(usuario, token):
            raise ValidationError("El enlace de restablecimiento no es válido o ya expiró.")

        validate_password(nueva_password, user=usuario)

        usuario.set_password(nueva_password)
        usuario.save(update_fields=["password"])

        return usuario
