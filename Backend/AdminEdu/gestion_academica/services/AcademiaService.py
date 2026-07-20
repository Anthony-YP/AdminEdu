from django.core.exceptions import ValidationError
from django.db import transaction

from gestion_academica.models.academia.Academia import Academia
from gestion_academica.models.core.Core import Direccion


class AcademiaService:
    """
    Contiene las reglas de negocio relacionadas con las academias.
    """

    @staticmethod
    def listar_academias():
        """
        Lista todas las academias registradas.
        """

        return Academia.objects.select_related(
            "direccion"
        ).all().order_by(
            "nombre"
        )

    @staticmethod
    @transaction.atomic
    def crear_academia(
        nombre: str,
        telefono: str,
        ciudad: str,
        calle_principal: str,
        calle_secundaria: str,
        numero_casa: str = "",
        referencia: str = ""
    ) -> Academia:
        """
        Crea una academia con su dirección asociada,
        aplicando las reglas de negocio.
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

        if not telefono or not telefono.strip():
            raise ValidationError(
                "El teléfono de la academia es obligatorio."
            )

        if not ciudad or not ciudad.strip():
            raise ValidationError(
                "La ciudad es obligatoria."
            )

        if not calle_principal or not calle_principal.strip():
            raise ValidationError(
                "La calle principal es obligatoria."
            )

        if not calle_secundaria or not calle_secundaria.strip():
            raise ValidationError(
                "La calle secundaria es obligatoria."
            )

        # Crear la dirección primero
        direccion = Direccion.objects.create(
            ciudad=ciudad.strip(),
            calle_principal=calle_principal.strip(),
            calle_secundaria=calle_secundaria.strip(),
            numero_casa=numero_casa.strip() if numero_casa else "",
            referencia=referencia.strip() if referencia else ""
        )

        return Academia.objects.create(
            nombre=nombre,
            telefono=telefono.strip(),
            direccion=direccion
        )

    @staticmethod
    @transaction.atomic
    def actualizar_academia(
        academia: Academia,
        nombre: str,
        telefono: str,
        ciudad: str,
        calle_principal: str,
        calle_secundaria: str,
        numero_casa: str = "",
        referencia: str = ""
    ) -> Academia:
        """
        Actualiza una academia y su dirección asociada,
        aplicando las reglas de negocio.
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

        # Actualizar la academia
        academia.nombre = nombre
        academia.telefono = telefono.strip() if telefono else academia.telefono

        # Actualizar la dirección asociada
        direccion = academia.direccion
        if direccion:
            direccion.ciudad = ciudad.strip() if ciudad else direccion.ciudad
            direccion.calle_principal = calle_principal.strip() if calle_principal else direccion.calle_principal
            direccion.calle_secundaria = calle_secundaria.strip() if calle_secundaria else direccion.calle_secundaria
            direccion.numero_casa = numero_casa.strip() if numero_casa else direccion.numero_casa
            direccion.referencia = referencia.strip() if referencia else direccion.referencia
            direccion.save()

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