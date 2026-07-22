from rest_framework import status
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet

from gestion_academica.models.academia.Academia import Curso

from gestion_academica.serializers.CursoSerializer import CursoSerializer

from gestion_academica.services.CursoService import CursoService



class CursoViewSet(PermisosViewSet):


    serializer_class = CursoSerializer


    def get_queryset(self):

        return CursoService.listar_cursos()



    def create(self,request):

        serializer = self.serializer_class(
            data=request.data
        )


        serializer.is_valid(
            raise_exception=True
        )


        curso = CursoService.crear_curso(
            serializer.validated_data
        )


        return Response(
            self.serializer_class(curso).data,
            status=status.HTTP_201_CREATED
        )



    def retrieve(self,request,pk=None):

        curso = CursoService.obtener_curso(
            pk
        )


        return Response(
            self.serializer_class(curso).data
        )



    def update(self,request,pk=None):

        curso = CursoService.obtener_curso(
            pk
        )


        serializer = self.serializer_class(
            curso,
            data=request.data,
            partial=True
        )


        serializer.is_valid(
            raise_exception=True
        )


        curso = CursoService.actualizar_curso(
            curso,
            serializer.validated_data
        )


        return Response(
            self.serializer_class(curso).data
        )



    def destroy(self,request,pk=None):

        curso = CursoService.obtener_curso(
            pk
        )


        CursoService.eliminar_curso(
            curso
        )


        return Response(
            status=status.HTTP_204_NO_CONTENT
        )