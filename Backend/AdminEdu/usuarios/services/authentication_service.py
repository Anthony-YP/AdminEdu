class AuthenticationService:
    """
    Servicio encargado de construir la información
    del usuario autenticado que será enviada al frontend.
    """

    @staticmethod
    def build_user_response(user):
        grupos = list(
            user.groups.values_list(
                "name",
                flat=True,
            )
        )

        permisos = list(
            user.get_all_permissions()
        )

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "grupos": grupos,
            "rol_principal": grupos[0] if grupos else None,
            "permisos": permisos,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }