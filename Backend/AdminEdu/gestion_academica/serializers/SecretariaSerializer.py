from rest_framework import serializers

from gestion_academica.models.persona.Persona import Secretaria
from gestion_academica.services.SecretariaService import SecretariaService


class SecretariaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Secretaria
        fields = [
            "id",
            "usuario",
            "direccion",
            "tipo_documento",
            "numero_identificacion",
            "nombres",
            "apellidos",
            "correo",
            "telefono",
            "fecha_nacimiento",
        ]
        read_only_fields = ["id"]


class SecretariaCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Secretaria
        fields = [
            "usuario",
            "direccion",
            "tipo_documento",
            "numero_identificacion",
            "nombres",
            "apellidos",
            "correo",
            "telefono",
            "fecha_nacimiento",
        ]

    def create(self, validated_data):
        return SecretariaService.crear_secretaria(**validated_data)

    def update(self, instance, validated_data):
        return SecretariaService.actualizar_secretaria(
            secretaria=instance,
            **validated_data
        )
