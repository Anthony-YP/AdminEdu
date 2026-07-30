from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.models.matricula.Matricula import CalificacionFinal, Matricula
from gestion_academica.serializers.CalificacionFinalSerializer import (
    CalificacionFinalSerializer,
    CalificacionFinalRegistrarSerializer,
    CalificacionFinalActualizarSerializer,
)
from gestion_academica.services.CalificacionFinalService import CalificacionFinalService
from usuarios.permissions import EsDocente, EsAdministrativo, EsPersonalInstitucion


class CalificacionFinalViewSet(PermisosViewSet):

    serializer_class = CalificacionFinalSerializer

    permission_read = EsPersonalInstitucion
    permission_create = EsDocente
    permission_update = EsDocente
    permission_delete = EsAdministrativo

    permission_actions = {
        "registrar": EsDocente,
        "actualizar": EsDocente,
    }

    def get_queryset(self):

        queryset = CalificacionFinal.objects.select_related(
            "calificacion_final",
            "calificacion_final__estudiante",
        )

        docente = getattr(getattr(self.request.user, "persona", None), "docente", None)

        if docente is not None and not self.request.user.is_superuser:
            queryset = queryset.filter(
                calificacion_final__paralelo_matricula__docente=docente
            )

        return queryset

    def _obtener_docente(self, request):
        return getattr(getattr(request.user, "persona", None), "docente", None)

    @action(detail=False, methods=["post"], url_path="registrar")
    def registrar(self, request):

        docente = self._obtener_docente(request)

        if docente is None:
            return Response(
                {"detail": "El usuario autenticado no tiene un perfil de docente asociado."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CalificacionFinalRegistrarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            matricula = Matricula.objects.get(id=serializer.validated_data["matricula_id"])
        except Matricula.DoesNotExist:
            return Response(
                {"detail": "La matrícula indicada no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            calificacion = CalificacionFinalService.registrar_calificacion(
                matricula=matricula,
                docente=docente,
                nota_final=serializer.validated_data["nota_final"],
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            CalificacionFinalSerializer(calificacion).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="actualizar")
    def actualizar(self, request, pk=None):

        docente = self._obtener_docente(request)

        if docente is None:
            return Response(
                {"detail": "El usuario autenticado no tiene un perfil de docente asociado."},
                status=status.HTTP_403_FORBIDDEN,
            )

        calificacion = self.get_object()

        try:
            matricula = calificacion.calificacion_final
        except Matricula.DoesNotExist:
            return Response(
                {"detail": "La calificación no está asociada a ninguna matrícula."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CalificacionFinalActualizarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            calificacion = CalificacionFinalService.actualizar_calificacion(
                matricula=matricula,
                docente=docente,
                nota_final=serializer.validated_data["nota_final"],
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            CalificacionFinalSerializer(calificacion).data,
            status=status.HTTP_200_OK,
        )
