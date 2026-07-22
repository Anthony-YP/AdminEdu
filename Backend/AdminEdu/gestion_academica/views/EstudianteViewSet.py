from rest_framework import permissions

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.EstudianteService import EstudianteService
from gestion_academica.api.serializers import EstudianteSerializer
from gestion_academica.serializers.EstudianteSerializer import (EstudianteCreateSerializer,)


class EstudianteViewSet(
    PermisosViewSet
):

    permission_create = permissions.IsAuthenticated

    permission_read = permissions.IsAuthenticated

    permission_update = permissions.IsAuthenticated

    permission_delete = permissions.IsAdminUser

    def get_queryset(self):

        return (
            EstudianteService.listar_estudiantes()
        )

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:

            return (
                EstudianteCreateSerializer
            )

        return EstudianteSerializer