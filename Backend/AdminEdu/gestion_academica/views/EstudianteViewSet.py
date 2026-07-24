from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.EstudianteService import EstudianteService
from gestion_academica.services.DirectorService import DirectorService
from gestion_academica.serializers.EstudianteSerializer import (EstudianteSerializer,EstudianteCreateSerializer, )
from usuarios.permissions import EsAdministrativo, EsDirector


class EstudianteViewSet(
    PermisosViewSet
):

    permission_create = EsAdministrativo

    permission_read = permissions.IsAuthenticated

    permission_update = EsAdministrativo

    permission_delete = permissions.IsAdminUser

    permission_actions = {
        "dar_baja": EsDirector,
    }

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

    @action(
        detail=True,
        methods=["post"],
        url_path="dar-baja",
    )
    def dar_baja(self, request, pk=None):

        estudiante = self.get_object()

        motivo = request.data.get("motivo")

        try:
            estudiante = DirectorService.dar_baja_estudiante(estudiante, motivo)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(estudiante).data,
            status=status.HTTP_200_OK,
        )