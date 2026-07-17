from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.AcademiaService import AcademiaService
from gestion_academica.api.serializers import AcademiaSerializer
from usuarios.permissions import EsDirector

class AcademiaViewSet(
    PermisosViewSet
):

    serializer_class = AcademiaSerializer

    permission_create = EsDirector

    permission_read = permissions.IsAuthenticated

    permission_update = EsDirector

    permission_delete = EsDirector

    def get_queryset(self):

        return AcademiaService.listar_academias()

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
            ]
        )

        response_serializer = self.get_serializer(
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

        serializer = self.get_serializer(
            academia,
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
            )
        )

        response_serializer = self.get_serializer(
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
