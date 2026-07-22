from rest_framework import serializers

from gestion_academica.models.academia.Academia import Academia
from gestion_academica.serializers.DireccionSerializer import DireccionSerializer


class AcademiaSerializer(serializers.ModelSerializer):
    """
    Serializer encargado de validar la información
    de una academia.
    """

    direccion = DireccionSerializer()

    class Meta:
        model = Academia
        fields = (
            "id",
            "nombre",
            "telefono",
            "direccion",
        )
        read_only_fields = ("id",)

    def validate_nombre(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "El nombre de la academia es obligatorio."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "El nombre debe contener al menos 3 caracteres."
            )

        return value

    def validate_telefono(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "El teléfono es obligatorio."
            )

        if not value.isdigit():
            raise serializers.ValidationError(
                "El teléfono solo puede contener números."
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "El teléfono debe tener exactamente 10 dígitos."
            )

        return value