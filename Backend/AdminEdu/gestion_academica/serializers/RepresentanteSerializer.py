from rest_framework import serializers

from gestion_academica.models.persona.Persona import Representante
from gestion_academica.services.RepresentanteService import RepresentanteService


class RepresentanteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Representante
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


class RepresentanteCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Representante
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
        return RepresentanteService.crear_representante(**validated_data)

    def update(self, instance, validated_data):
        return RepresentanteService.actualizar_representante(
            representante=instance,
            **validated_data
        )