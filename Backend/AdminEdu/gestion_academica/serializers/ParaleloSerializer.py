from rest_framework import serializers

from gestion_academica.models.academia.Academia import (
    Paralelo,
)


class ParaleloSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Paralelo

        fields = [
            "curso",
            "docente",
            "nombre",
            "dias_clase",
            "hora_inicio",
            "hora_fin",
            "cupo_max",
            "estado",
        ]

        read_only_fields = [
            "estado"
        ]