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

        # En una actualización parcial (PATCH), `attrs` solo trae los campos
        # enviados; se valida sobre una copia del propio registro (o uno
        # nuevo si es creación) con esos campos aplicados encima, para no
        # rechazar campos obligatorios que simplemente no cambiaron.
        persona = self.instance or Persona()

        for campo, valor in attrs.items():
            setattr(persona, campo, valor)

        PersonaService.validar_persona(persona)

        return attrs