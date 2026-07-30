from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.SecretariaService import SecretariaService
from gestion_academica.serializers.SecretariaSerializer import SecretariaSerializer, SecretariaCreateSerializer
from usuarios.permissions import EsAdministrativo


class SecretariaViewSet(PermisosViewSet):

    permission_create = EsAdministrativo
    permission_read = EsAdministrativo
    permission_update = EsAdministrativo
    permission_delete = EsAdministrativo

    def get_queryset(self):
        return SecretariaService.listar_secretarias()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SecretariaCreateSerializer
        return SecretariaSerializer