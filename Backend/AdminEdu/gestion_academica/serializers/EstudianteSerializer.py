from rest_framework import serializers

from ..models.persona.Persona import Estudiante
from ..services.EstudianteService import EstudianteService


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
        ]

        read_only_fields = [
            "id",
        ]


class EstudianteCreateSerializer(
    serializers.ModelSerializer
):

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

        return (
            EstudianteService.crear_estudiante(
                **validated_data
            )
        )

    def update(
        self,
        instance,
        validated_data
    ):

        return (
            EstudianteService.actualizar_estudiante(
                estudiante=instance,
                **validated_data
            )
        )