from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.AcademiaService import AcademiaService
from gestion_academica.serializers.AcademiaSerializer import AcademiaSerializer, AcademiaCreateSerializer
from usuarios.permissions import EsDirector

class AcademiaViewSet(
    PermisosViewSet
):

    permission_create = EsDirector

    permission_read = permissions.IsAuthenticated

    permission_update = EsDirector

    permission_delete = EsDirector

    def get_queryset(self):

        return AcademiaService.listar_academias()

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update"
        ]:

            return AcademiaCreateSerializer

        return AcademiaSerializer

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

        academia = AcademiaService.crear_academia(
            nombre=serializer.validated_data[
                "nombre"
            ],
            telefono=serializer.validated_data[
                "telefono"
            ],
            ciudad=serializer.validated_data[
                "ciudad"
            ],
            calle_principal=serializer.validated_data[
                "calle_principal"
            ],
            calle_secundaria=serializer.validated_data[
                "calle_secundaria"
            ],
            numero_casa=serializer.validated_data.get(
                "numero_casa", ""
            ),
            referencia=serializer.validated_data.get(
                "referencia", ""
            ),
        )

        response_serializer = AcademiaSerializer(
            academia
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

        academia = self.get_object()

        serializer = AcademiaCreateSerializer(
            data=request.data,
            partial=partial
        )

        serializer.is_valid(
            raise_exception=True
        )

        academia = AcademiaService.actualizar_academia(
            academia=academia,
            nombre=serializer.validated_data.get(
                "nombre",
                academia.nombre
            ),
            telefono=serializer.validated_data.get(
                "telefono",
                academia.telefono
            ),
            ciudad=serializer.validated_data.get(
                "ciudad",
                academia.direccion.ciudad if academia.direccion else ""
            ),
            calle_principal=serializer.validated_data.get(
                "calle_principal",
                academia.direccion.calle_principal if academia.direccion else ""
            ),
            calle_secundaria=serializer.validated_data.get(
                "calle_secundaria",
                academia.direccion.calle_secundaria if academia.direccion else ""
            ),
            numero_casa=serializer.validated_data.get(
                "numero_casa",
                academia.direccion.numero_casa if academia.direccion else ""
            ),
            referencia=serializer.validated_data.get(
                "referencia",
                academia.direccion.referencia if academia.direccion else ""
            ),
        )

        response_serializer = AcademiaSerializer(
            academia
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

        academia = self.get_object()

        AcademiaService.eliminar_academia(
            academia
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
