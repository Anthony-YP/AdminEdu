from gestion_academica.models.persona.Persona import Secretaria
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.services.BaseService import BaseService


class SecretariaService(PersonaService, BaseService):

    @staticmethod
    def registrar_secretaria(secretaria):

        PersonaService.validar_persona(secretaria)

        return True

    @staticmethod
    def crear_secretaria(**datos):

        secretaria = Secretaria(**datos)

        SecretariaService.registrar_secretaria(secretaria)

        secretaria.save()

        return secretaria

    @staticmethod
    def actualizar_secretaria(secretaria, **datos):

        for campo, valor in datos.items():
            setattr(secretaria, campo, valor)

        SecretariaService.registrar_secretaria(secretaria)

        secretaria.save()

        return secretaria

    @staticmethod
    def listar_secretarias():

        return Secretaria.objects.all()
