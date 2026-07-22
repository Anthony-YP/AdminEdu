from rest_framework import permissions, status
from rest_framework.response import Response

from gestion_academica.models.academia.Academia import Academia
from gestion_academica.serializers.AcademiaSerializer import AcademiaSerializer
from gestion_academica.services.AcademiaService import AcademiaService
from gestion_academica.views.CoreViewSet import PermisosViewSet


class AcademiaViewSet(PermisosViewSet):
    """
    ViewSet encargado de exponer la API de Academias.
    """

    queryset = Academia.objects.select_related(
        "direccion"
    ).all()

    serializer_class = AcademiaSerializer

    permission_read = permissions.IsAuthenticated
    permission_create = permissions.IsAuthenticated
    permission_update = permissions.IsAuthenticated
    permission_delete = permissions.IsAuthenticated

    def get_queryset(self):
        return AcademiaService.listar_academias()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        academia = AcademiaService.crear_academia(
            serializer.validated_data
        )

        response = self.get_serializer(
            academia
        )

        return Response(
            response.data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        academia = AcademiaService.obtener_academia(
            kwargs["pk"]
        )

        serializer = self.get_serializer(
            academia,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        academia = AcademiaService.actualizar_academia(
            academia,
            serializer.validated_data
        )

        response = self.get_serializer(
            academia
        )

        return Response(response.data)

    def partial_update(self, request, *args, **kwargs):
        academia = AcademiaService.obtener_academia(
            kwargs["pk"]
        )

        serializer = self.get_serializer(
            academia,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        academia = AcademiaService.actualizar_academia(
            academia,
            serializer.validated_data
        )

        response = self.get_serializer(
            academia
        )

        return Response(response.data)

    def destroy(self, request, *args, **kwargs):
        academia = AcademiaService.obtener_academia(
            kwargs["pk"]
        )

        AcademiaService.eliminar_academia(
            academia
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )