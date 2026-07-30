
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
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
    @transaction.atomic
    def dar_baja_estudiante(
        estudiante,
        motivo
    ):

        if not motivo or not motivo.strip():

            raise ValidationError(
                "Debe ingresar el motivo de la baja."
            )

        if estudiante.usuario is None:
            raise ValidationError(
                "El estudiante no tiene una cuenta de usuario asociada."
            )

        estudiante.usuario.is_active = False
        estudiante.usuario.save(update_fields=["is_active"])

        estudiante.motivo_baja = motivo.strip()
        estudiante.fecha_baja = timezone.now().date()
        estudiante.save(update_fields=["motivo_baja", "fecha_baja"])

        return estudiante