from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.api.serializers import ParaleloSerializer
from gestion_academica.services.ParaleloService import ParaleloService
from usuarios.permissions import EsAdministrativo


class ParaleloViewSet(
    PermisosViewSet
):

    serializer_class = ParaleloSerializer

    permission_create = EsAdministrativo

    permission_read = permissions.IsAuthenticated

    permission_update = EsAdministrativo

    permission_delete = EsAdministrativo

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

            docente=serializer.validated_data[
                "docente"
            ],

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