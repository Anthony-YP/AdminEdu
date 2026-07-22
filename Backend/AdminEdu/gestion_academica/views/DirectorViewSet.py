from rest_framework import permissions

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.DirectorService import DirectorService

from gestion_academica.serializers.DirectorSerializer import DirectorSerializer,DirectorCreateSerializer
from usuarios.permissions import EsDirector


class DirectorViewSet(PermisosViewSet):

    permission_create = EsDirector
    permission_read = permissions.IsAuthenticated
    permission_update = EsDirector
    permission_delete = EsDirector

    def get_queryset(self):
        return DirectorService.listar_directores()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return DirectorCreateSerializer
        return DirectorSerializer
