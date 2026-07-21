from django.core.exceptions import ValidationError

from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.models.matricula.estado_matricula import EstadoMatricula
from gestion_academica.services.MatriculaService import MatriculaService
from gestion_academica.services.BaseService import  BaseService


class SecretariaService(PersonaService, BaseService):

    @staticmethod
    def registrar_secretaria(secretaria):

        PersonaService.validar_persona(secretaria)

        return True

    @staticmethod
    def actualizar_secretaria(secretaria):

        PersonaService.validar_persona(secretaria)

        return True

    @staticmethod
    def visualizar_matriculas_pendientes():

        from gestion_academica.models.matricula.Matricula import Matricula

        return Matricula.objects.filter(
            estado=EstadoMatricula.PENDIENTE
        )

    @staticmethod
    def visualizar_comprobante(matricula):

        if matricula.comprobante_pago is None:
            raise ValidationError(
                "La matrícula no posee un comprobante registrado."
            )

        return matricula.comprobante_pago

    @staticmethod
    def aprobar_matricula(matricula):

        MatriculaService.aprobar_matricula(matricula)

        return True

    @staticmethod
    def rechazar_matricula(matricula):

        MatriculaService.rechazar_matricula(matricula)

        return True

    @staticmethod
    def matricula_manual(matricula):

        MatriculaService.validar_cupo(
            matricula.paralelo_matricula
        )

        MatriculaService.validar_comprobante(
            matricula.comprobante_pago
        )

        matricula.estado = EstadoMatricula.APROBADA

        return True

    @staticmethod
    def cambiar_estado(matricula, estado):

        if estado not in EstadoMatricula.values:
            raise ValidationError(
                "Estado de matrícula no válido."
            )

        matricula.estado = estado

        return True