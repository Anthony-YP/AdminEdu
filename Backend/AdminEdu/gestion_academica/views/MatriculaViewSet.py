from django.utils import timezone

from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed

from usuarios.permissions import (
    EsEstudiante,
    EsSecretaria
)

from ..models.matricula.Matricula import Matricula
from ..models.academia.Academia import Paralelo
from ..models.persona.Persona import Estudiante
from ..models.pagos.Pagos import ComprobantePago

from ..services.MatriculaService import (
    MatriculaService
)

from ..serializers.MatriculaSerializer import (
    MatriculaSerializer,
    MatriculaRechazarSerializer,
    MatriculaCancelarSerializer,
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

        "cancelar": EsSecretaria,

        "manual": EsSecretaria,

        "culminar": EsSecretaria,

    }

    def get_serializer_class(self):

        if self.action == "rechazar":

            return MatriculaRechazarSerializer

        if self.action == "cancelar":

            return MatriculaCancelarSerializer

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
        raise MethodNotAllowed(
            "POST",
            detail=(
                "No se pueden crear matrículas por esta vía. "
                "Use aspirante/solicitar-matricula/ (estudiante) "
                "o matriculas/manual/ (secretaría)."
            ),
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
            many=True,
            context={"request": request},
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
            matricula,
            context={"request": request},
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
                matricula,
                context={"request": request},
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="cancelar"
    )
    def cancelar(
        self,
        request,
        pk=None
    ):

        matricula = self.get_object()

        serializer = (
            MatriculaCancelarSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        matricula = (
            MatriculaService.cancelar_matricula(
                matricula=matricula,
                comentario=serializer.validated_data[
                    "comentario"
                ]
            )
        )

        response_serializer = (
            MatriculaSerializer(
                matricula,
                context={"request": request},
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
        """
        RF16: la secretaría matricula manualmente a un estudiante ya
        registrado, adjuntando el comprobante de pago en el mismo paso
        (mismo patrón que AspiranteMatriculaView).
        """

        estudiante_id = request.data.get("estudiante")
        paralelo_id = request.data.get("paralelo_matricula")
        comprobante = request.data.get("comprobante")
        tipo_pago = request.data.get("tipo_pago", "EFECTIVO")
        monto = request.data.get("monto", "0.00")
        numero_ref = request.data.get("numero_ref", "")

        if not estudiante_id or not paralelo_id:
            return Response(
                {"detail": "Debe indicar el estudiante y el paralelo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not comprobante:
            return Response(
                {"detail": "Debe adjuntar el comprobante de pago."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        nombre_archivo = getattr(comprobante, "name", "") or ""
        if not nombre_archivo.lower().endswith((".pdf", ".png")):
            return Response(
                {"detail": "El comprobante debe ser un archivo PDF o PNG."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            estudiante = Estudiante.objects.get(id=estudiante_id)
            paralelo = Paralelo.objects.get(id=paralelo_id)
        except (Estudiante.DoesNotExist, Paralelo.DoesNotExist):
            return Response(
                {"detail": "El estudiante o el paralelo indicado no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        comprobante_pago = ComprobantePago.objects.create(
            tipo_pago=tipo_pago,
            tipo_archivo=comprobante,
            monto=monto,
            fecha=timezone.now().date(),
            numero_ref=numero_ref if numero_ref else None,
        )

        try:
            matricula = MatriculaService.crear_matricula_manual(
                estudiante=estudiante,
                paralelo=paralelo,
                comprobante_pago=comprobante_pago,
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = MatriculaSerializer(
            matricula, context={"request": request}
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
            matricula,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )