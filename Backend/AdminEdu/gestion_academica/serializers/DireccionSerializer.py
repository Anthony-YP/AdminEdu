from rest_framework import serializers

from gestion_academica.models.core.Core import Direccion


class DireccionSerializer(serializers.ModelSerializer):
    """
    Serializer encargado únicamente de validar
    la información de una dirección.
    """

    class Meta:
        model = Direccion
        fields = (
            "ciudad",
            "calle_principal",
            "calle_secundaria",
            "numero_casa",
            "referencia",
        )

    def validate_ciudad(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "La ciudad es obligatoria."
            )

        return value

    def validate_calle_principal(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "La calle principal es obligatoria."
            )

        return value

    def validate_calle_secundaria(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "La calle secundaria es obligatoria."
            )

        return value

    def validate_numero_casa(self, value):
        return value.strip() if value else ""

    def validate_referencia(self, value):
        return value.strip() if value else ""