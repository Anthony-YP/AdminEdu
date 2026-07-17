from django.core.exceptions import ValidationError

from gestion_academica.services.PersonaServices import PersonaService


class RepresentanteService(PersonaService):

    @staticmethod
    def registrar_representante(representante):

        PersonaService.validar_persona(representante)

        return True

    @staticmethod
    def actualizar_representante(representante):

        PersonaService.validar_persona(representante)

        return True

    @staticmethod
    def asociar_estudiante(representante, estudiante):
        if estudiante is None:
            raise ValidationError(
                "Debe seleccionar un estudiante."
            )

        estudiante.representante = representante

        return True

    @staticmethod
    def desasociar_estudiante(estudiante):

        estudiante.representante = None

        return True

    @staticmethod
    def visualizar_estudiantes(representante):
        if hasattr(representante, "estudiantes"):
            return representante.estudiantes.all()

        return []

    @staticmethod
    def visualizar_perfil(representante):

        return representante

    @staticmethod
    def editar_perfil(representante):

        PersonaService.validar_persona(representante)

        return True