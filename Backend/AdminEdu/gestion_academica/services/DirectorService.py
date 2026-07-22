
from django.core.exceptions import ValidationError
from gestion_academica.models.persona.Persona import Director
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.services.BaseService import BaseService

class DirectorService(PersonaService, BaseService):

    @staticmethod
    def registrar_director(director):

        PersonaService.validar_persona(director)

        return True

    @staticmethod
    def crear_director(**datos):

        director = Director(**datos)

        DirectorService.registrar_director(director)

        director.save()

        return director

    @staticmethod
    def actualizar_director(director, **datos):

        for campo, valor in datos.items():
            setattr(director, campo, valor)

        DirectorService.registrar_director(director)

        director.save()

        return director

    @staticmethod
    def listar_directores():

        return Director.objects.all()

    @staticmethod
    def visualizar_cursos():

        from gestion_academica.models.academia.Academia import Curso

        return Curso.objects.all()

    @staticmethod
    def crear_paralelo(paralelo):

        if paralelo.cupo_max <= 0:
            raise ValidationError(
                "El cupo máximo debe ser mayor que cero."
            )

        if paralelo.hora_inicio >= paralelo.hora_fin:
            raise ValidationError(
                "La hora de inicio debe ser menor que la hora de fin."
            )

        return True

    @staticmethod
    def validar_fechas_curso(curso):

        if curso.fecha_inicio >= curso.fecha_fin:
            raise ValidationError(
                "La fecha de inicio debe ser anterior a la fecha de finalización."
            )

        return True

    @staticmethod
    def dar_baja_estudiante(
        estudiante,
        motivo
    ):

        if not motivo or not motivo.strip():

            raise ValidationError(
                "Debe ingresar el motivo de la baja."
            )

        if hasattr(estudiante, "estado"):

            estudiante.estado = "INACTIVO"

        return True