from rest_framework import serializers

from gestion_academica.models.academia.Academia import (
    Paralelo,
)


class ParaleloSerializer(
    serializers.ModelSerializer
):

    curso_nombre = serializers.CharField(source="curso.nombre", read_only=True)
    docente_nombre = serializers.SerializerMethodField()

    class Meta:

        model = Paralelo

        fields = [
            "id",
            "curso",
            "curso_nombre",
            "docente",
            "docente_nombre",
            "nombre",
            "dias_clase",
            "hora_inicio",
            "hora_fin",
            "cupo_max",
            "estado",
        ]

    def get_docente_nombre(self, obj):
        if obj.docente:
            return f"{obj.docente.nombres} {obj.docente.apellidos}"
        return None