from django.contrib.auth.models import Group

from usuarios.models import (
    Usuario,
    GRUPO_ASPIRANTE,
)


class AspiranteService:
    """
    Gestiona la lógica relacionada con los aspirantes.
    """

    @staticmethod
    def registrar(usuario: Usuario):

        grupo = Group.objects.get(
            name=GRUPO_ASPIRANTE
        )

        if not usuario.groups.filter(
            id=grupo.id
        ).exists():

            usuario.groups.add(grupo)

        return usuario