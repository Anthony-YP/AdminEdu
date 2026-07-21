from django.core.exceptions import ValidationError

from gestion_academica.services.PersonaService import PersonaService

class DirectorService(PersonaService):

    @staticmethod
    def registrar_director(director):

        PersonaService.validar_persona(director)

        return True

    @staticmethod
    def actualizar_director(director):

        PersonaService.validar_persona(director)

        return True

    @staticmethod
    def dar_baja_estudiante(estudiante, motivo):

        if not motivo or not motivo.strip():
            raise ValidationError(
                "Debe ingresar el motivo de la baja del estudiante."
            )

        # Si el modelo incorpora posteriormente un campo estado,
        # se podrá activar esta línea.
        #
        # estudiante.estado = "INACTIVO"

        return True

    @staticmethod
    def visualizar_docentes():

        from gestion_academica.models.persona.Persona import Docente

        return Docente.objects.all()

    @staticmethod
    def visualizar_secretarias():

        from gestion_academica.models.persona.Persona import Secretaria

        return Secretaria.objects.all()

    @staticmethod
    def visualizar_estudiantes():

        from gestion_academica.models.persona.Persona import Estudiante

        return Estudiante.objects.all()

    @staticmethod
    def visualizar_cursos():

        from gestion_academica.models.academia.Academia import Curso

        return Curso.objects.all()

    @staticmethod
    def visualizar_paralelos():

        from gestion_academica.models.academia.Academia import Paralelo

        return Paralelo.objects.all()