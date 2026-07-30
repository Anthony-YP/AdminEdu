from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.serializers.DocenteSerializer import DocenteSerializer
from gestion_academica.serializers.ParaleloSerializer import ParaleloSerializer
from gestion_academica.services.DocenteService import DocenteService
from usuarios.permissions import EsAdministrativo, EsDocente


class DocenteViewSet(PermisosViewSet):
    serializer_class = DocenteSerializer

    permission_create = EsAdministrativo
    permission_read = EsAdministrativo
    permission_update = EsAdministrativo
    permission_delete = EsAdministrativo

    permission_actions = {
        "mis_paralelos": EsDocente,
    }

    def get_queryset(self):
        return self.get_serializer().Meta.model.objects.all().order_by("nombres", "apellidos")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="mis-paralelos")
    def mis_paralelos(self, request):
        """RF23: paralelos/cursos asignados al docente autenticado."""

        docente = getattr(getattr(request.user, "persona", None), "docente", None)

        if docente is None:
            return Response(
                {"detail": "El usuario autenticado no tiene un perfil de docente asociado."},
                status=status.HTTP_403_FORBIDDEN,
            )

        paralelos = DocenteService.visualizar_cursos(docente)

        return Response(
            ParaleloSerializer(paralelos, many=True).data,
            status=status.HTTP_200_OK,
        )
