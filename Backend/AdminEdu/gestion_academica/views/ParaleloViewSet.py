from rest_framework import status
from rest_framework.response import Response


from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.serializers.ParaleloSerializer import (ParaleloSerializer)
from gestion_academica.services.ParaleloService import (ParaleloService)

class ParaleloViewSet(PermisosViewSet):


    serializer_class = ParaleloSerializer



    def get_queryset(self):


        return ParaleloService.listar_paralelos()




    def create(self,request):


        serializer = self.serializer_class(
            data=request.data
        )


        serializer.is_valid(
            raise_exception=True
        )



        paralelo = ParaleloService.crear_paralelo(
            serializer.validated_data
        )



        return Response(

            self.serializer_class(paralelo).data,

            status=status.HTTP_201_CREATED
        )





    def retrieve(self,request,pk=None):


        paralelo = ParaleloService.obtener_paralelo(
            pk
        )


        return Response(

            self.serializer_class(paralelo).data
        )





    def update(self,request,pk=None):


        paralelo = ParaleloService.obtener_paralelo(
            pk
        )



        serializer = self.serializer_class(

            paralelo,

            data=request.data,

            partial=True
        )



        serializer.is_valid(
            raise_exception=True
        )



        paralelo = ParaleloService.actualizar_paralelo(

            paralelo,

            serializer.validated_data
        )



        return Response(

            self.serializer_class(paralelo).data

        )





    def destroy(self,request,pk=None):


        paralelo = ParaleloService.obtener_paralelo(
            pk
        )



        ParaleloService.eliminar_paralelo(
            paralelo
        )



        return Response(

            status=status.HTTP_204_NO_CONTENT

        )