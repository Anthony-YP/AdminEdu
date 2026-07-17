from rest_framework import serializers

from gestion_academica.models.academia.Academia import Curso


class CursoCreateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Curso

        fields = [
            "academia",
            "nombre",
            "precio",
            "fecha_inicio",
            "fecha_fin",
        ]

        extra_kwargs = {
            "nombre": {
                "required": True
            },
            "precio": {
                "required": True
            },
            "fecha_inicio": {
                "required": True
            },
            "fecha_fin": {
                "required": True
            },
        }