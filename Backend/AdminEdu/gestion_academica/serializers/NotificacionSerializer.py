from rest_framework import serializers
from gestion_academica.models.notificaciones.Notificacion import Notificacion


class NotificacionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notificacion
        fields = "__all__"
        read_only_fields = (
            "id",
            "usuario",
            "fecha",
        )


class NotificacionCreateSerializer(serializers.ModelSerializer):
    """
    RF28: permite a la secretaría (u otro personal administrativo)
    crear una notificación indicando explícitamente el destinatario.
    """

    class Meta:
        model = Notificacion
        fields = ("id", "usuario", "mensaje", "fecha")
        read_only_fields = ("id", "fecha")
