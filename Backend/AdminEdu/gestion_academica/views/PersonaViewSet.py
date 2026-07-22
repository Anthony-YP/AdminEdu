from rest_framework import permissions

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.api.serializers import PersonaSerializer
from gestion_academica.serializers.PersonaSerializer import PersonaCreateSerializer


class PersonaViewSet(PermisosViewSet):

    permission_create = permissions.IsAuthenticated

    permission_read = permissions.IsAuthenticated

    permission_update = permissions.IsAuthenticated

    permission_delete = permissions.IsAdminUser

    def get_queryset(self):

        if self.request.user.is_authenticated:
            return PersonaService.listar_personas().filter(usuario=self.request.user)

        return PersonaService.listar_personas().none()

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update"
        ]:

            return PersonaCreateSerializer

        return PersonaSerializer