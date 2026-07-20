from django.core.exceptions import ValidationError

from gestion_academica.services.PersonaService import PersonaService

class EstudianteService(PersonaService):

    @staticmethod
    def registrar_estudiante(estudiante):

        PersonaService.validar_persona(estudiante)

        return True

    @staticmethod
    def actualizar_estudiante(estudiante):
        PersonaService.validar_persona(estudiante)

        return True

    @staticmethod
    def validar_requisitos_matricula(estudiante):

        # Si es menor de edad debe tener representante.
        if PersonaService.es_menor_edad(estudiante.fecha_nacimiento):

            if estudiante.representante is None:
                raise ValidationError(
                    "Los estudiantes menores de edad deben registrar un representante."
                )

        # Validar que el estudiante esté activo (si el modelo tiene estado).
        if hasattr(estudiante, "estado"):

            if str(estudiante.estado).upper() != "ACTIVO":
                raise ValidationError(
                    "Solo los estudiantes activos pueden solicitar una matrícula."
                )

        return True

    @staticmethod
    def solicitar_matricula(estudiante):
        PersonaService.validar_persona(estudiante)

        EstudianteService.validar_requisitos_matricula(estudiante)

        return True

    @staticmethod
    def registrar_representante(estudiante, representante):

        estudiante.representante = representante

        return True

    @staticmethod
    def visualizar_cursos():
        return True

    @staticmethod
    def visualizar_historial():
        return True

    @staticmethod
    def visualizar_perfil(estudiante):
        return estudiante

    @staticmethod
    def editar_perfil(estudiante):

        PersonaService.validar_persona(estudiante)

        return True