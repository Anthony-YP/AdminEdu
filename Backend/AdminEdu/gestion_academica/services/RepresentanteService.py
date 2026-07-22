from gestion_academica.models.persona.Persona import Representante
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.services.BaseService import BaseService


class RepresentanteService(PersonaService, BaseService):

    @staticmethod
    def registrar_representante(representante):

        PersonaService.validar_persona(representante)

        return True

    @staticmethod
    def crear_representante(**datos):

        representante = Representante(**datos)

        RepresentanteService.registrar_representante(
            representante
        )

        representante.save()

        return representante

    @staticmethod
    def actualizar_representante(
        representante,
        **datos
    ):

        for campo, valor in datos.items():
            setattr(
                representante,
                campo,
                valor
            )

        RepresentanteService.registrar_representante(
            representante
        )

        representante.save()

        return representante

    @staticmethod
    def listar_representantes():

        return Representante.objects.all()

    @staticmethod
    def eliminar_representante(
        representante
    ):

        representante.delete()