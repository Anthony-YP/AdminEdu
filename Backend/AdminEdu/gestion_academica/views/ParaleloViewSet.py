from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.serializers.ParaleloSerializer import ParaleloSerializer
from gestion_academica.services.ParaleloService import ParaleloService
from gestion_academica.services.MatriculaService import MatriculaService
from usuarios.permissions import EsAdministrativo, EsDocente


class ParaleloViewSet(
    PermisosViewSet
):

    serializer_class = ParaleloSerializer

    permission_create = EsAdministrativo

    permission_read = permissions.IsAuthenticated

    permission_update = EsAdministrativo

    permission_delete = EsAdministrativo

    permission_actions = {
        "estado": EsAdministrativo,
        "matriculas": EsDocente,
    }

    def get_queryset(self):

        return ParaleloService.listar_paralelos()

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        paralelo = ParaleloService.crear_paralelo(
            curso=serializer.validated_data[
                "curso"
            ],

            docente=serializer.validated_data.get(
                "docente"
            ),

            nombre=serializer.validated_data[
                "nombre"
            ],

            dias_clase=serializer.validated_data[
                "dias_clase"
            ],

            hora_inicio=serializer.validated_data[
                "hora_inicio"
            ],

            hora_fin=serializer.validated_data[
                "hora_fin"
            ],

            cupo_max=serializer.validated_data[
                "cupo_max"
            ],
        )

        response_serializer = self.get_serializer(
            paralelo
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        partial = kwargs.pop(
            "partial",
            False
        )

        paralelo = self.get_object()

        serializer = self.get_serializer(
            paralelo,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(
            raise_exception=True
        )

        paralelo = ParaleloService.actualizar_paralelo(
            paralelo=paralelo,

            curso=serializer.validated_data.get(
                "curso",
                paralelo.curso
            ),

            docente=serializer.validated_data.get(
                "docente",
                paralelo.docente
            ),

            nombre=serializer.validated_data.get(
                "nombre",
                paralelo.nombre
            ),

            dias_clase=serializer.validated_data.get(
                "dias_clase",
                paralelo.dias_clase
            ),

            hora_inicio=serializer.validated_data.get(
                "hora_inicio",
                paralelo.hora_inicio
            ),

            hora_fin=serializer.validated_data.get(
                "hora_fin",
                paralelo.hora_fin
            ),

            cupo_max=serializer.validated_data.get(
                "cupo_max",
                paralelo.cupo_max
            ),
        )

        response_serializer = self.get_serializer(
            paralelo
        )

        return Response(
            response_serializer.data
        )

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        paralelo = self.get_object()

        ParaleloService.eliminar_paralelo(
            paralelo
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="estado",
    )
    def estado(self, request, pk=None):

        paralelo = self.get_object()

        nuevo_estado = request.data.get("estado")

        if not nuevo_estado:
            return Response(
                {"detail": "Debe indicar el nuevo estado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            paralelo = ParaleloService.cambiar_estado(paralelo, nuevo_estado)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(paralelo).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="matriculas",
    )
    def matriculas(self, request, pk=None):
        """
        RF24/RF25: estudiantes matriculados (aprobados) de un paralelo,
        para que su docente pueda registrar asistencia y calificaciones.
        """

        paralelo = self.get_object()

        docente = getattr(getattr(request.user, "persona", None), "docente", None)

        es_propietario = docente is not None and paralelo.docente_id == docente.pk

        if not (es_propietario or request.user.is_superuser or request.user.groups.filter(name="Administrador").exists()):
            return Response(
                {"detail": "No tiene acceso a los estudiantes de este paralelo."},
                status=status.HTTP_403_FORBIDDEN,
            )

        matriculas = MatriculaService.listar_matriculas_paralelo(paralelo)

        resultado = [
            {
                "matricula_id": m.id,
                "estudiante_id": m.estudiante_id,
                "nombres": m.estudiante.nombres,
                "apellidos": m.estudiante.apellidos,
                "numero_identificacion": m.estudiante.numero_identificacion,
                "calificacion_final_id": m.calificacion_final_id,
                "nota_final": str(m.calificacion_final.nota_final) if m.calificacion_final else None,
                "porcentaje_asistencia": MatriculaService.calcular_porcentaje_asistencia(m),
            }
            for m in matriculas
        ]

        return Response(resultado, status=status.HTTP_200_OK)