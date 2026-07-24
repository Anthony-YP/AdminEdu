from rest_framework import serializers

from ..models.persona.Persona import Estudiante
from ..models.core.Core import Direccion
from ..services.EstudianteService import EstudianteService
from .DireccionSerializer import DireccionSerializer


class EstudianteSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Estudiante

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
            "representante_legal",
            "motivo_baja",
            "fecha_baja",
        ]

        read_only_fields = [
            "id",
            "motivo_baja",
            "fecha_baja",
        ]


class EstudianteCreateSerializer(
    serializers.ModelSerializer
):

    direccion = DireccionSerializer()

    class Meta:

        model = Estudiante

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
            "representante_legal",
        ]

    def create(
        self,
        validated_data
    ):

        direccion_data = validated_data.pop("direccion")
        direccion = Direccion.objects.create(**direccion_data)

        return (
            EstudianteService.crear_estudiante(
                direccion=direccion,
                **validated_data
            )
        )

    def update(
        self,
        instance,
        validated_data
    ):

        direccion_data = validated_data.pop("direccion", None)

        if direccion_data:
            for campo, valor in direccion_data.items():
                setattr(instance.direccion, campo, valor)
            instance.direccion.save()

        return (
            EstudianteService.actualizar_estudiante(
                estudiante=instance,
                **validated_data
            )
        )