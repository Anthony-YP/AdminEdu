from datetime import date
from decimal import Decimal

from django.db import transaction
from django.core.exceptions import ValidationError

from gestion_academica.models.academia.Academia import Curso
from gestion_academica.models.academia.Academia import Academia


class CursoService:
    """
    Contiene todas las reglas de negocio
    relacionadas con Curso.
    """

    @staticmethod
    def listar_cursos():
        return Curso.objects.select_related(
            "academia"
        ).all()


    @staticmethod
    def obtener_curso(curso_id):

        try:
            return Curso.objects.select_related(
                "academia"
            ).get(
                id=curso_id
            )

        except Curso.DoesNotExist:
            raise ValidationError(
                "El curso no existe"
            )


    @staticmethod
    @transaction.atomic
    def crear_curso(data):

        academia = data.get("academia")
        nombre = data.get("nombre")
        precio = data.get("precio")
        fecha_inicio = data.get("fecha_inicio")
        fecha_fin = data.get("fecha_fin")


        CursoService.validar_datos(
            nombre,
            precio,
            fecha_inicio,
            fecha_fin
        )


        if not Academia.objects.filter(
            id=academia.id
        ).exists():

            raise ValidationError(
                "La academia indicada no existe"
            )


        if Curso.objects.filter(
            academia=academia,
            nombre__iexact=nombre
        ).exists():

            raise ValidationError(
                "Ya existe un curso con ese nombre en la academia"
            )


        curso = Curso.objects.create(
            academia=academia,
            nombre=nombre,
            precio=precio,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin
        )


        return curso



    @staticmethod
    @transaction.atomic
    def actualizar_curso(curso, data):

        nombre = data.get(
            "nombre",
            curso.nombre
        )

        precio = data.get(
            "precio",
            curso.precio
        )

        fecha_inicio = data.get(
            "fecha_inicio",
            curso.fecha_inicio
        )

        fecha_fin = data.get(
            "fecha_fin",
            curso.fecha_fin
        )


        CursoService.validar_datos(
            nombre,
            precio,
            fecha_inicio,
            fecha_fin
        )


        if Curso.objects.filter(
            academia=curso.academia,
            nombre__iexact=nombre
        ).exclude(
            id=curso.id
        ).exists():

            raise ValidationError(
                "Ya existe otro curso con ese nombre"
            )


        curso.nombre = nombre
        curso.precio = precio
        curso.fecha_inicio = fecha_inicio
        curso.fecha_fin = fecha_fin


        curso.save()


        return curso



    @staticmethod
    @transaction.atomic
    def eliminar_curso(curso):

        curso.delete()



    @staticmethod
    def validar_datos(
        nombre,
        precio,
        fecha_inicio,
        fecha_fin
    ):


        if not nombre:
            raise ValidationError(
                "El nombre del curso es obligatorio"
            )


        if precio <= Decimal("0"):
            raise ValidationError(
                "El precio debe ser mayor a cero"
            )


        if fecha_inicio < date.today():

            raise ValidationError(
                "La fecha de inicio no puede estar en el pasado"
            )


        if fecha_fin <= fecha_inicio:

            raise ValidationError(
                "La fecha final debe ser posterior a la inicial"
            )