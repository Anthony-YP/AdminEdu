from datetime import date
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction

from gestion_academica.models.academia.Academia import (
    Academia,
    Curso,
)


class CursoService:
    """
    Contiene las reglas de negocio relacionadas con los cursos.
    """

    @staticmethod
    def validar_fechas(fecha_inicio, fecha_fin):
        """
        RF21:
        La fecha de inicio debe ser anterior a la fecha de finalización.
        """

        if fecha_inicio >= fecha_fin:
            raise ValidationError(
                "La fecha de inicio debe ser anterior "
                "a la fecha de finalización."
            )

    @staticmethod
    def validar_precio(precio):
        """
        El precio de un curso no puede ser negativo.
        """

        if precio < Decimal("0.00"):
            raise ValidationError(
                "El precio del curso no puede ser negativo."
            )

    @staticmethod
    @transaction.atomic
    def crear_curso(
        academia: Academia,
        nombre: str,
        precio: Decimal,
        fecha_inicio: date,
        fecha_fin: date
    ) -> Curso:
        """
        Crea un curso aplicando las reglas de negocio.
        """

        if academia is None:
            raise ValidationError(
                "La academia es obligatoria."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del curso es obligatorio."
            )

        CursoService.validar_fechas(
            fecha_inicio,
            fecha_fin
        )

        CursoService.validar_precio(precio)

        nombre = nombre.strip()

        curso_existente = Curso.objects.filter(
            academia=academia,
            nombre__iexact=nombre
        ).exists()

        if curso_existente:
            raise ValidationError(
                "Ya existe un curso con ese nombre "
            )

        return Curso.objects.create(
            academia=academia,
            nombre=nombre,
            precio=precio,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin
        )

    @staticmethod
    @transaction.atomic
    def actualizar_curso(
        curso: Curso,
        academia: Academia,
        nombre: str,
        precio: Decimal,
        fecha_inicio: date,
        fecha_fin: date
    ) -> Curso:
        """
        Actualiza un curso aplicando las mismas reglas de negocio
        utilizadas durante su creación.
        """

        if curso is None:
            raise ValidationError(
                "El curso no existe."
            )

        if academia is None:
            raise ValidationError(
                "La academia es obligatoria."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del curso es obligatorio."
            )

        CursoService.validar_fechas(
            fecha_inicio,
            fecha_fin
        )

        CursoService.validar_precio(precio)

        nombre = nombre.strip()

        curso_existente = Curso.objects.filter(
            academia=academia,
            nombre__iexact=nombre
        ).exclude(
            pk=curso.pk
        ).exists()

        if curso_existente:
            raise ValidationError(
                "Ya existe otro curso con ese nombre "
                "en esta academia."
            )

        curso.academia = academia
        curso.nombre = nombre
        curso.precio = precio
        curso.fecha_inicio = fecha_inicio
        curso.fecha_fin = fecha_fin

        curso.save()

        return curso

    @staticmethod
    def listar_cursos():
        """
        Lista todos los cursos registrados.
        """

        return Curso.objects.all().order_by("nombre")

    @staticmethod
    def eliminar_curso(curso: Curso):
        """
        Elimina un curso aplicando las reglas de negocio.
        """
        if curso is None:
            raise ValidationError(
                "El curso no existe."
            )

        curso.delete()