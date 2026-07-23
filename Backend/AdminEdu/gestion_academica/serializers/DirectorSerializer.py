from rest_framework import serializers

from gestion_academica.models.persona.Persona import Director
from gestion_academica.services.DirectorService import DirectorService


class DirectorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Director
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


class DirectorCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Director
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
        return DirectorService.crear_director(**validated_data)

    def update(self, instance, validated_data):
        return DirectorService.actualizar_director(
            director=instance,
            **validated_data
        )