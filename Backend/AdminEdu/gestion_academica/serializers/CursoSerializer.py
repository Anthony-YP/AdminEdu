from rest_framework import serializers

from gestion_academica.models.academia.Academia import Curso


class CursoCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Curso

        fields = [
            "academia",
            "nombre",
            "descripcion",
            "imagen",
            "precio",
            "fecha_inicio",
            "fecha_fin",
        ]

        extra_kwargs = {
            "nombre": {
                "required": True
            },
            "descripcion": {
                "required": True
            },
            "imagen": {
                "required": False
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

class CursoSerializer(serializers.ModelSerializer):

    academia_nombre = serializers.CharField(
        source="academia.nombre",
        read_only=True
    )

    class Meta:

        model = Curso

        fields = "__all__"