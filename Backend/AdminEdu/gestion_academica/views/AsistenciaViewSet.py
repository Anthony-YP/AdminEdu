from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.models.matricula.Matricula import Asistencia
from gestion_academica.models.academia.Academia import Paralelo
from gestion_academica.serializers.AsistenciaSerializer import (
    AsistenciaSerializer,
    AsistenciaBulkCreateSerializer,
)
from gestion_academica.services.DocenteService import DocenteService
from usuarios.permissions import EsDocente, EsAdministrativo, EsPersonalInstitucion


class AsistenciaViewSet(PermisosViewSet):

    serializer_class = AsistenciaSerializer

    permission_read = EsPersonalInstitucion
    permission_create = EsDocente
    permission_update = EsDocente
    permission_delete = EsAdministrativo

    permission_actions = {
        "registrar": EsDocente,
    }

    def get_queryset(self):

        queryset = Asistencia.objects.select_related(
            "matricula",
            "matricula__estudiante",
            "matricula__paralelo_matricula",
        )

        docente = getattr(getattr(self.request.user, "persona", None), "docente", None)

        if docente is not None and not self.request.user.is_superuser:
            queryset = queryset.filter(
                matricula__paralelo_matricula__docente=docente
            )

        paralelo_id = self.request.query_params.get("paralelo_id")
        if paralelo_id:
            queryset = queryset.filter(
                matricula__paralelo_matricula_id=paralelo_id
            )

        return queryset.order_by("-fecha")

    @action(detail=False, methods=["post"], url_path="registrar")
    def registrar(self, request):

        docente = getattr(getattr(request.user, "persona", None), "docente", None)

        if docente is None:
            return Response(
                {"detail": "El usuario autenticado no tiene un perfil de docente asociado."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AsistenciaBulkCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            paralelo = Paralelo.objects.get(id=serializer.validated_data["paralelo_id"])
        except Paralelo.DoesNotExist:
            return Response(
                {"detail": "El paralelo indicado no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            asistencias = DocenteService.registrar_asistencia_bulk(
                paralelo=paralelo,
                docente=docente,
                fecha=serializer.validated_data["fecha"],
                registros=serializer.validated_data["registros"],
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            AsistenciaSerializer(asistencias, many=True).data,
            status=status.HTTP_201_CREATED,
        )
