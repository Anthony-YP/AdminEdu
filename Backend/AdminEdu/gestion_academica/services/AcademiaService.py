from django.core.exceptions import ValidationError
from django.db import transaction

from gestion_academica.models.academia.Academia import Academia


class AcademiaService:
    """
    Contiene las reglas de negocio relacionadas con las academias.
    """

    @staticmethod
    def listar_academias():
        """
        Lista todas las academias registradas.
        """

        return Academia.objects.all().order_by(
            "nombre"
        )

    @staticmethod
    @transaction.atomic
    def crear_academia(
        nombre: str
    ) -> Academia:
        """
        Crea una academia aplicando las reglas de negocio.
        """

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre de la academia es obligatorio."
            )

        nombre = nombre.strip()

        academia_existente = Academia.objects.filter(
            nombre__iexact=nombre
        ).exists()

        if academia_existente:
            raise ValidationError(
                "Ya existe una academia con ese nombre."
            )

        return Academia.objects.create(
            nombre=nombre
        )

    @staticmethod
    @transaction.atomic
    def actualizar_academia(
        academia: Academia,
        nombre: str
    ) -> Academia:
        """
        Actualiza una academia aplicando las reglas de negocio.
        """

        if academia is None:
            raise ValidationError(
                "La academia no existe."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre de la academia es obligatorio."
            )

        nombre = nombre.strip()

        academia_existente = Academia.objects.filter(
            nombre__iexact=nombre
        ).exclude(
            pk=academia.pk
        ).exists()

        if academia_existente:
            raise ValidationError(
                "Ya existe otra academia con ese nombre."
            )

        academia.nombre = nombre

        academia.save()

        return academia

    @staticmethod
    @transaction.atomic
    def eliminar_academia(
        academia: Academia
    ):
        """
        Elimina una academia aplicando las reglas de negocio.
        """

        if academia is None:
            raise ValidationError(
                "La academia no existe."
            )

        academia.delete()