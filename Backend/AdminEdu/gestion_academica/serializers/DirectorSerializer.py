from rest_framework import serializers

from gestion_academica.models.persona.Persona import Director
from gestion_academica.models.core.Core import Direccion
from gestion_academica.services.DirectorService import DirectorService
from gestion_academica.serializers.DireccionSerializer import DireccionSerializer


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

    direccion = DireccionSerializer()

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
        direccion_data = validated_data.pop("direccion")
        direccion = Direccion.objects.create(**direccion_data)
        return DirectorService.crear_director(direccion=direccion, **validated_data)

    def update(self, instance, validated_data):
        direccion_data = validated_data.pop("direccion", None)
        if direccion_data:
            for campo, valor in direccion_data.items():
                setattr(instance.direccion, campo, valor)
            instance.direccion.save()
        return DirectorService.actualizar_director(
            director=instance,
            **validated_data
        )