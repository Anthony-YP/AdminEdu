from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.CursoService import CursoService
from gestion_academica.serializers.CursoSerializer import CursoSerializer, CursoCreateSerializer
from gestion_academica.models.academia.estado_curso import EstadoCurso
from usuarios.permissions import EsDirector

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class CursoViewSet(
    PermisosViewSet
):
    parser_classes = (
        MultiPartParser,
        FormParser,
        JSONParser,
    )

    permission_create = EsDirector

    permission_read = permissions.IsAuthenticated

    permission_update = EsDirector

    permission_delete = EsDirector

    permission_actions = {
        "estado": EsDirector,
        "publicos": permissions.AllowAny,
    }

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

    @action(
        detail=False,
        methods=["get"],
        url_path="publicos",
    )
    def publicos(self, request):
        # Solo se muestran cursos habilitados (ACTIVO): un aspirante o
        # invitado no debe ver ni poder solicitar cursos desactivados o
        # cerrados.
        cursos = CursoService.listar_cursos().filter(estado=EstadoCurso.ACTIVO)
        serializer = CursoSerializer(cursos, many=True, context={"request": request})
        return Response(serializer.data)

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

            academia=serializer.validated_data["academia"],

            nombre=serializer.validated_data["nombre"],

            descripcion=serializer.validated_data["descripcion"],

            imagen=serializer.validated_data.get("imagen"),

            precio=serializer.validated_data["precio"],

            fecha_inicio=serializer.validated_data["fecha_inicio"],

            fecha_fin=serializer.validated_data["fecha_fin"],
        )

        # Respuesta completa (no CursoCreateSerializer): el frontend guarda
        # este resultado directamente en su estado local, y CursoCreateSerializer
        # no incluye "id", "estado" ni "paralelos" — sin esto, un curso recién
        # creado quedaba con id indefinido hasta el próximo refresco.
        response_serializer = CursoSerializer(
            curso,
            context={"request": request},
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

            descripcion=serializer.validated_data.get(
                "descripcion",
                curso.descripcion
            ),

            imagen=serializer.validated_data.get(
                "imagen",
                None
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

        # Misma razón que en create(): se devuelve el curso completo, no la
        # forma reducida de CursoCreateSerializer, para que el estado local
        # del frontend (id, estado, paralelos) no quede corrupto tras editar.
        response_serializer = CursoSerializer(
            curso,
            context={"request": request},
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

    @action(
        detail=True,
        methods=["post"],
        url_path="estado",
    )
    def estado(self, request, pk=None):

        curso = self.get_object()

        nuevo_estado = request.data.get("estado")

        if not nuevo_estado:
            return Response(
                {"detail": "Debe indicar el nuevo estado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            curso = CursoService.cambiar_estado(curso, nuevo_estado)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(curso).data,
            status=status.HTTP_200_OK,
        )