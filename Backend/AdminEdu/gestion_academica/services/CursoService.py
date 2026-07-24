from datetime import date
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from gestion_academica.models.academia.Academia import (
    Academia,
    Curso,
)
from gestion_academica.models.academia.estado_curso import EstadoCurso


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
        descripcion: str,
        imagen,
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
            descripcion=descripcion.strip(),
            imagen=imagen,
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
        descripcion: str,
        imagen,
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
        
        if not descripcion or not descripcion.strip():
            raise ValidationError(
                "La descripción del curso es obligatoria."
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
        curso.descripcion = descripcion.strip()
        if  imagen is not None: curso.imagen = imagen
        curso.precio = precio
        curso.fecha_inicio = fecha_inicio
        curso.fecha_fin = fecha_fin

        curso.save()

        return curso

    @staticmethod
    def cerrar_cursos_vencidos():
        """
        RF20:
        Cierra automáticamente (de forma perezosa, al consultar)
        cualquier curso cuya fecha de fin ya pasó y que todavía
        no esté marcado como CERRADO.
        """

        Curso.objects.filter(
            fecha_fin__lt=timezone.now().date()
        ).exclude(
            estado=EstadoCurso.CERRADO
        ).update(
            estado=EstadoCurso.CERRADO
        )

    @staticmethod
    def listar_cursos():
        """
        Lista todos los cursos registrados.
        """

        CursoService.cerrar_cursos_vencidos()

        return Curso.objects.all().order_by("nombre")

    @staticmethod
    def cambiar_estado(curso: Curso, nuevo_estado: str) -> Curso:
        """
        RF18/RF21:
        Cambia el estado de un curso (ACTIVO, DESACTIVADO, CERRADO).
        """

        if curso is None:
            raise ValidationError(
                "El curso no existe."
            )

        if nuevo_estado not in EstadoCurso.values:
            raise ValidationError(
                "El estado indicado no es válido."
            )

        curso.estado = nuevo_estado
        curso.save(update_fields=["estado"])

        return curso

    @staticmethod
    def eliminar_curso(curso: Curso):
        """
        Da de baja lógica a un curso (lo desactiva) en vez de
        borrarlo físicamente, para preservar el historial de
        matrículas, asistencia y calificaciones asociado.
        """
        if curso is None:
            raise ValidationError(
                "El curso no existe."
            )

        return CursoService.cambiar_estado(curso, EstadoCurso.DESACTIVADO)