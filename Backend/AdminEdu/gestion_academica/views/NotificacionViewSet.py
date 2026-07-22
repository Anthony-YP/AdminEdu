from rest_framework import permissions
from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.models.notificaciones.Notificacion import Notificacion
from gestion_academica.serializers.NotificacionSerializer import NotificacionSerializer


class NotificacionViewSet(PermisosViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_read = permissions.IsAuthenticated
    permission_create = permissions.IsAuthenticated
    permission_update = permissions.IsAuthenticated
    permission_delete = permissions.IsAuthenticated

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Notificacion.objects.filter(usuario=self.request.user)
        return Notificacion.objects.none()
