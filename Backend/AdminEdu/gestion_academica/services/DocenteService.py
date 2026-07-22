from datetime import date, timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.services.BaseService import  BaseService

class DocenteService(PersonaService, BaseService):

    @staticmethod
    def registrar_docente(docente):

        PersonaService.validar_persona(docente)
        DocenteService.validar_titulo(docente.titulo)
        DocenteService.validar_especialidad(docente.especialidad)

        return True

    @staticmethod
    def actualizar_docente(docente):

        PersonaService.validar_persona(docente)
        DocenteService.validar_titulo(docente.titulo)
        DocenteService.validar_especialidad(docente.especialidad)

        return True

    @staticmethod
    def validar_titulo(titulo):

        if not titulo or not titulo.strip():
            raise ValidationError(
                "El título del docente es obligatorio."
            )

        if len(titulo.strip()) < 3:
            raise ValidationError(
                "El título es demasiado corto."
            )
        if len(titulo.strip()) > 100:
            raise ValidationError(
                "El título no puede superar los 100 caracteres."
            )

        return True

    @staticmethod
    def validar_especialidad(especialidad):

        if not especialidad or not especialidad.strip():
            raise ValidationError(
                "La especialidad es obligatoria."
            )

        if len(especialidad.strip()) < 3:
            raise ValidationError(
                "La especialidad es demasiado corta."
            )
        if len(especialidad.strip()) > 100:
            raise ValidationError(
                "La especialidad no puede superar los 100 caracteres."
            )

        return True

    @staticmethod
    def visualizar_cursos(docente):

        return docente.paralelos.all()

    @staticmethod
    def registrar_asistencia(asistencia):

        if asistencia.matricula is None:
            raise ValidationError(
                "La asistencia debe pertenecer a una matrícula."
            )

        return True

    @staticmethod
    def modificar_asistencia(asistencia):

        hoy = timezone.now().date()

        if (hoy - asistencia.fecha) > timedelta(days=3):
            raise ValidationError(
                "Solo puede modificar la asistencia dentro de los primeros 3 días."
            )

        return True

    @staticmethod
    def registrar_calificacion(calificacion):

        if calificacion.nota_final < 0 or calificacion.nota_final > 10:
            raise ValidationError(
                "La nota debe estar entre 0 y 10."
            )
        if calificacion is None:
            raise ValidationError(
                "La calificación es obligatoria."
            )

        calificacion.aprobado = calificacion.nota_final >= 7

        return True