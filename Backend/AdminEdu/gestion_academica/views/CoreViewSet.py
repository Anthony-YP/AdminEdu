from rest_framework import permissions
from rest_framework import viewsets


class PermisosViewSet(
    viewsets.ModelViewSet
):
    """
    ViewSet base para centralizar
    la configuración de permisos.
    """

    permission_create = (
        permissions.IsAuthenticated
    )

    permission_read = (
        permissions.IsAuthenticated
    )

    permission_update = (
        permissions.IsAuthenticated
    )

    permission_delete = (
        permissions.IsAuthenticated
    )

    permission_actions = {}

    def get_permissions(self):

        if self.action in (
            "list",
            "retrieve"
        ):

            permission_class = (
                self.permission_read
            )

        elif self.action == "create":

            permission_class = (
                self.permission_create
            )

        elif self.action in (
            "update",
            "partial_update"
        ):

            permission_class = (
                self.permission_update
            )

        elif self.action == "destroy":

            permission_class = (
                self.permission_delete
            )

        elif self.action in (
            self.permission_actions
        ):

            permission_class = (
                self.permission_actions[
                    self.action
                ]
            )

        else:

            permission_class = (
                permissions.IsAuthenticated
            )

        return [
            permission_class()
        ]