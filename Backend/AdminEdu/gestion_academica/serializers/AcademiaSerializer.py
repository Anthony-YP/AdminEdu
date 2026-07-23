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


class AcademiaCreateSerializer(
    serializers.Serializer
):
    """
    Serializer para crear/actualizar academias.
    Incluye los campos de Direccion de forma plana.
    """

    nombre = serializers.CharField(
        max_length=100,
        required=True
    )

    telefono = serializers.CharField(
        max_length=10,
        required=True
    )

    ciudad = serializers.CharField(
        max_length=25,
        required=True
    )

    calle_principal = serializers.CharField(
        max_length=50,
        required=True
    )

    calle_secundaria = serializers.CharField(
        max_length=50,
        required=True
    )

    numero_casa = serializers.CharField(
        max_length=10,
        required=False,
        allow_blank=True,
        default=""
    )

    referencia = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )