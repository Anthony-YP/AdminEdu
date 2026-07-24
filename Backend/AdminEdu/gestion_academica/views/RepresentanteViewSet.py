from rest_framework import permissions

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.RepresentanteService import RepresentanteService
from gestion_academica.serializers.RepresentanteSerializer import RepresentanteSerializer,RepresentanteCreateSerializer
from usuarios.permissions import EsRepresentante, EsAdministrativo


class RepresentanteViewSet(PermisosViewSet):

    permission_create = EsAdministrativo
    permission_read = permissions.IsAuthenticated
    permission_update = EsAdministrativo
    permission_delete = permissions.IsAdminUser

    def get_queryset(self):
        return RepresentanteService.listar_representantes()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return RepresentanteCreateSerializer
        return RepresentanteSerializer