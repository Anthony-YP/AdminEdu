from rest_framework import permissions
from rest_framework import status

from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.CursoService import CursoService
from gestion_academica.api.serializers import CursoSerializer
from gestion_academica.serializers.CursoSerializer import CursoCreateSerializer
from usuarios.permissions import EsDirector


class CursoViewSet(
    PermisosViewSet
):

    permission_create = EsDirector

    permission_read = permissions.IsAuthenticated

    permission_update = EsDirector

    permission_delete = EsDirector

    def get_queryset(self):

        return CursoService.listar_cursos()

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update"
        ]:

            return CursoCreateSerializer

        return CursoSerializer

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

        curso = CursoService.crear_curso(
            academia=serializer.validated_data[
                "academia"
            ],

            nombre=serializer.validated_data[
                "nombre"
            ],

            precio=serializer.validated_data[
                "precio"
            ],

            fecha_inicio=serializer.validated_data[
                "fecha_inicio"
            ],

            fecha_fin=serializer.validated_data[
                "fecha_fin"
            ],
        )

        response_serializer = self.get_serializer(
            curso
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

        curso = self.get_object()

        serializer = self.get_serializer(
            curso,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(
            raise_exception=True
        )

        curso = CursoService.actualizar_curso(
            curso=curso,

            academia=serializer.validated_data.get(
                "academia",
                curso.academia
            ),

            nombre=serializer.validated_data.get(
                "nombre",
                curso.nombre
            ),

            precio=serializer.validated_data.get(
                "precio",
                curso.precio
            ),

            fecha_inicio=serializer.validated_data.get(
                "fecha_inicio",
                curso.fecha_inicio
            ),

            fecha_fin=serializer.validated_data.get(
                "fecha_fin",
                curso.fecha_fin
            ),
        )

        response_serializer = self.get_serializer(
            curso
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

        curso = self.get_object()

        CursoService.eliminar_curso(
            curso
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )