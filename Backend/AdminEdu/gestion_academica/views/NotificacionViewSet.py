from rest_framework import permissions
from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.models.notificaciones.Notificacion import Notificacion
from gestion_academica.serializers.NotificacionSerializer import (
    NotificacionSerializer,
    NotificacionCreateSerializer,
)
from usuarios.permissions import EsAdministrativo


class NotificacionViewSet(PermisosViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_read = permissions.IsAuthenticated
    permission_create = EsAdministrativo
    permission_update = EsAdministrativo
    permission_delete = EsAdministrativo

    def get_serializer_class(self):
        if self.action == "create":
            return NotificacionCreateSerializer
        return NotificacionSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Notificacion.objects.filter(usuario=self.request.user)
        return Notificacion.objects.none()
