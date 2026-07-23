from django.contrib.auth import get_user_model

User = get_user_model()


class GoogleAuthService:
    """
    Servicio encargado de validar la autenticación
    mediante Google.

    Este servicio NO genera respuestas HTTP.

    Su única responsabilidad es validar que el usuario
    autenticado por Google pueda acceder a AdminEdu.
    """

    @staticmethod
    def get_user_by_email(email: str):
        """
        Obtiene un usuario por su correo.

        Args:
            email (str): El correo del usuario.

        Retorna:
            Usuario si existe.

        Retorna:
        None si no existe.
        """

        try:
            return User.objects.get(email=email)

        except User.DoesNotExist:
            return None


    @staticmethod
    def is_active(user):
        """
        Verifica si el usuario está activo.
        """

        return user.is_active
    

    @staticmethod
    def is_email_verified(social_account):
        """
        Verifica que Google haya confirmado
        el correo electrónico.
        """

        return social_account.extra_data.get(
            "email_verified",
            False,
        )