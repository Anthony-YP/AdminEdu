from rest_framework import serializers

from gestion_academica.models.academia.Academia import Academia


class AcademiaSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Academia

        fields = [
            "nombre"
        ]

        extra_kwargs = {
            "nombre": {
                "required": True
            }
        }