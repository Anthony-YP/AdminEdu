from django.contrib.auth import get_user_model

User = get_user_model()


class GoogleAuthService:
    """
    Validar que el usuario
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