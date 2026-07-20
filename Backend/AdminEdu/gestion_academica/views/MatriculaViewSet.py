from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from usuarios.permissions import (
    EsEstudiante,
    EsSecretaria
)

from ..models.matricula.Matricula import Matricula

from ..services.MatriculaService import (
    MatriculaService
)

from ..serializers.MatriculaSerializer import (
    MatriculaSerializer,
    MatriculaCreateSerializer,
    MatriculaRechazarSerializer,
    MatriculaManualSerializer
)

from .CoreViewSet import (
    PermisosViewSet
)


class MatriculaViewSet(
    PermisosViewSet
):

    queryset = Matricula.objects.all()

    serializer_class = MatriculaSerializer

    permission_create = (
        EsEstudiante
    )

    permission_read = (
        permissions.IsAuthenticated
    )

    permission_update = (
        EsSecretaria
    )

    permission_delete = (
        EsSecretaria
    )

    permission_actions = {

        "pendientes": EsSecretaria,

        "aprobar": EsSecretaria,

        "rechazar": EsSecretaria,

        "manual": EsSecretaria,

        "culminar": EsSecretaria,

    }

    def get_serializer_class(self):

        if self.action == "create":

            return MatriculaCreateSerializer

        if self.action == "rechazar":

            return MatriculaRechazarSerializer

        if self.action == "manual":

            return MatriculaManualSerializer

        return MatriculaSerializer

    def get_queryset(self):

        queryset = (
            Matricula.objects
            .select_related(
                "estudiante",
                "paralelo_matricula",
                "paralelo_matricula__curso",
                "paralelo_matricula__docente",
                "comprobante_pago",
                "calificacion_final"
            )
        )

        if self.request.user.groups.filter(
            name="Estudiante"
        ).exists():

            return queryset.filter(
                estudiante__usuario=(
                    self.request.user
                )
            )

        return queryset

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        serializer = self.get_serializer(
            data=request.data,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        matricula = serializer.save()

        response_serializer = (
            MatriculaSerializer(
                matricula
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="pendientes"
    )
    def pendientes(
        self,
        request
    ):

        matriculas = (
            MatriculaService.listar_pendientes()
        )

        serializer = MatriculaSerializer(
            matriculas,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="aprobar"
    )
    def aprobar(
        self,
        request,
        pk=None
    ):

        matricula = self.get_object()

        matricula = (
            MatriculaService.aprobar_matricula(
                matricula
            )
        )

        serializer = MatriculaSerializer(
            matricula
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="rechazar"
    )
    def rechazar(
        self,
        request,
        pk=None
    ):

        matricula = self.get_object()

        serializer = (
            MatriculaRechazarSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        matricula = (
            MatriculaService.rechazar_matricula(
                matricula=matricula,
                comentario=serializer.validated_data[
                    "comentario"
                ]
            )
        )

        response_serializer = (
            MatriculaSerializer(
                matricula
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="manual"
    )
    def manual(
        self,
        request
    ):

        serializer = (
            MatriculaManualSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        matricula = serializer.save()

        response_serializer = (
            MatriculaSerializer(
                matricula
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="culminar"
    )
    def culminar(
        self,
        request,
        pk=None
    ):

        matricula = self.get_object()

        matricula = (
            MatriculaService.culminar_matricula(
                matricula
            )
        )

        serializer = MatriculaSerializer(
            matricula
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )