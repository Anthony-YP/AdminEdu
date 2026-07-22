from rest_framework import serializers

from gestion_academica.models.persona.Persona import Persona
from gestion_academica.services.PersonaService import PersonaService


class PersonaSerializer(serializers.ModelSerializer):

    class Meta:

        model = Persona

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

        read_only_fields = [
            "id",
        ]


class PersonaCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Persona

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

    def validate(self, attrs):

        persona = Persona(**attrs)

        PersonaService.validar_persona(persona)

        return attrs