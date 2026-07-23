from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from usuarios.models import (
    GRUPO_ASPIRANTE,
)

User = get_user_model()


class GoogleUserService:
    """
    Servicio encargado de buscar o crear usuarios
    autenticados mediante Google.
    """

    @staticmethod
    def get_or_create_user(
        email: str,
        first_name: str,
        last_name: str,
    ):
        """
        Busca un usuario por correo.

        Si no existe,
        lo crea y lo registra como Aspirante.
        """

        usuario, creado = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "is_active": True,
            },
        )

        if creado:

            grupo = Group.objects.get(
                name=GRUPO_ASPIRANTE
            )

            usuario.groups.add(grupo)

        return usuario