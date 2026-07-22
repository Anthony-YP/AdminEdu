from django.core.exceptions import ValidationError

from gestion_academica.models.persona.Persona import Estudiante
from gestion_academica.services.PersonaService import PersonaService


class EstudianteService(PersonaService):

    @staticmethod
    def registrar_estudiante(estudiante):

        PersonaService.validar_persona(estudiante)

        if (
            PersonaService.es_menor_edad(
                estudiante.fecha_nacimiento
            )
            and estudiante.representante_legal is None
        ):
            raise ValidationError(
                "Los estudiantes menores de edad deben tener un representante legal."
            )

        return True

    @staticmethod
    def crear_estudiante(**datos):

        estudiante = Estudiante(**datos)

        EstudianteService.registrar_estudiante(
            estudiante
        )

        estudiante.save()

        return estudiante

    @staticmethod
    def actualizar_estudiante(
        estudiante,
        **datos
    ):

        for campo, valor in datos.items():
            setattr(
                estudiante,
                campo,
                valor
            )

        EstudianteService.registrar_estudiante(
            estudiante
        )

        estudiante.save()

        return estudiante

    @staticmethod
    def listar_estudiantes():

        return Estudiante.objects.all()

    @staticmethod
    def eliminar_estudiante(
        estudiante
    ):

        estudiante.delete()