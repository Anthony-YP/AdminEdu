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