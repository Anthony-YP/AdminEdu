from rest_framework import serializers

from gestion_academica.models.persona.Persona import Docente
from gestion_academica.services.DocenteService import DocenteService


class DocenteSerializer(serializers.ModelSerializer):

    class Meta:

        model = Docente

        fields = [
            "id",
            "persona",
            "titulo",
            "especialidad",
        ]

    def validate(self, attrs):

        instance = self.instance

        docente = Docente(
            persona=attrs.get(
                "persona",
                instance.persona if instance else None
            ),

            titulo=attrs.get(
                "titulo",
                instance.titulo if instance else None
            ),

            especialidad=attrs.get(
                "especialidad",
                instance.especialidad if instance else None
            )
        )

        DocenteService.validar_titulo(
            docente.titulo
        )

        DocenteService.validar_especialidad(
            docente.especialidad
        )

        return attrs

    def create(self, validated_data):

        docente = Docente.objects.create(
            **validated_data
        )

        DocenteService.registrar_docente(
            docente
        )

        return docente

    def update(
        self,
        instance,
        validated_data
    ):

        for campo, valor in validated_data.items():

            setattr(
                instance,
                campo,
                valor
            )

        DocenteService.actualizar_docente(
            instance
        )

        instance.save()

        return instance