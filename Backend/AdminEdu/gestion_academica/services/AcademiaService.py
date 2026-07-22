from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError

from gestion_academica.models.academia.Academia import Academia
from gestion_academica.models.core.Core import Direccion


class AcademiaService:
    """
    Contiene las reglas de negocio relacionadas con las academias.
    """

    @staticmethod
    def listar_academias():
        """
        Retorna todas las academias con su dirección.
        """

        return (
            Academia.objects
            .select_related("direccion")
            .order_by("nombre")
        )

    @staticmethod
    def obtener_academia(pk: int) -> Academia:
        """
        Obtiene una academia por su id.
        """

        try:
            return Academia.objects.select_related(
                "direccion"
            ).get(pk=pk)

        except Academia.DoesNotExist:
            raise ValidationError(
                "La academia no existe."
            )

    @staticmethod
    @transaction.atomic
    def crear_academia(validated_data: dict) -> Academia:
        """
        Crea una academia con su dirección.
        """

        direccion_data = validated_data.pop("direccion")

        nombre = validated_data["nombre"]

        if Academia.objects.filter(
            nombre__iexact=nombre
        ).exists():
            raise ValidationError(
                "Ya existe una academia con ese nombre."
            )

        direccion = Direccion.objects.create(
            **direccion_data
        )

        try:

            academia = Academia.objects.create(
                direccion=direccion,
                **validated_data
            )

        except IntegrityError:
            raise ValidationError(
                "No fue posible crear la academia."
            )

        return academia

    @staticmethod
    @transaction.atomic
    def actualizar_academia(
        academia: Academia,
        validated_data: dict
    ) -> Academia:
        """
        Actualiza una academia y su dirección.
        """

        direccion_data = validated_data.pop(
            "direccion",
            None
        )

        nombre = validated_data.get(
            "nombre",
            academia.nombre
        )

        if Academia.objects.filter(
            nombre__iexact=nombre
        ).exclude(
            pk=academia.pk
        ).exists():
            raise ValidationError(
                "Ya existe otra academia con ese nombre."
            )

        for campo, valor in validated_data.items():
            setattr(
                academia,
                campo,
                valor
            )

        academia.save()

        if direccion_data:

            direccion = academia.direccion

            for campo, valor in direccion_data.items():
                setattr(
                    direccion,
                    campo,
                    valor
                )

            direccion.save()

        return academia

    @staticmethod
    @transaction.atomic
    def eliminar_academia(
        academia: Academia
    ):
        """
        Elimina una academia.

        Regla de negocio:
        No se puede eliminar una academia
        que tenga cursos registrados.
        """

        if academia.cursos.exists():
            raise ValidationError(
                "No se puede eliminar una academia que posee cursos registrados."
            )

        academia.direccion.delete()
        academia.delete()