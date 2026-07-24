from rest_framework import serializers

from gestion_academica.models.persona.Persona import Docente
from gestion_academica.models.core.Core import Direccion
from gestion_academica.services.DocenteService import DocenteService
from gestion_academica.serializers.DireccionSerializer import DireccionSerializer


class DocenteSerializer(serializers.ModelSerializer):

    direccion = DireccionSerializer()

    class Meta:

        model = Docente

        fields = "__all__"

    def validate(self, attrs):

        instance = self.instance

        titulo = attrs.get(
            "titulo",
            instance.titulo if instance else None
        )

        especialidad = attrs.get(
            "especialidad",
            instance.especialidad if instance else None
        )

        DocenteService.validar_titulo(titulo)

        DocenteService.validar_especialidad(especialidad)

        return attrs

    def create(self, validated_data):

        direccion_data = validated_data.pop("direccion")
        direccion = Direccion.objects.create(**direccion_data)

        docente = Docente.objects.create(
            direccion=direccion,
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

        direccion_data = validated_data.pop("direccion", None)

        if direccion_data:
            for campo, valor in direccion_data.items():
                setattr(instance.direccion, campo, valor)
            instance.direccion.save()

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