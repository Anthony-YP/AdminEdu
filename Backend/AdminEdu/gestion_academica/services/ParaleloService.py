from datetime import time

from django.core.exceptions import ValidationError
from django.db import transaction

from gestion_academica.models.academia.Academia import (
    Curso,
    Paralelo,
)

from gestion_academica.models.persona.Persona import (
    Docente,
)


class ParaleloService:
    """
    Contiene las reglas de negocio relacionadas
    con los paralelos.
    """

    @staticmethod
    def validar_horario(
        hora_inicio: time,
        hora_fin: time
    ):
        """
        La hora de inicio debe ser anterior
        a la hora de finalización.
        """

        if hora_inicio >= hora_fin:
            raise ValidationError(
                "La hora de inicio debe ser anterior "
                "a la hora de finalización."
            )

    @staticmethod
    def validar_cupo(
        cupo_max: int
    ):
        """
        El cupo máximo debe ser mayor que cero.
        """

        if cupo_max <= 0:
            raise ValidationError(
                "El cupo máximo debe ser mayor que cero."
            )

    @staticmethod
    def listar_paralelos():

        return Paralelo.objects.all().order_by(
            "curso__nombre",
            "nombre"
        )

    @staticmethod
    def listar_por_curso(
        curso: Curso
    ):

        if curso is None:
            raise ValidationError(
                "El curso es obligatorio."
            )

        return Paralelo.objects.filter(
            curso=curso
        ).order_by(
            "nombre"
        )

    @staticmethod
    @transaction.atomic
    def crear_paralelo(
        curso: Curso,
        docente: Docente,
        nombre: str,
        dias_clase: str,
        hora_inicio: time,
        hora_fin: time,
        cupo_max: int
    ) -> Paralelo:
        """
        Crea un paralelo aplicando las reglas
        de negocio.
        """

        if curso is None:
            raise ValidationError(
                "El curso es obligatorio."
            )

        if docente is None:
            raise ValidationError(
                "El docente es obligatorio."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del paralelo es obligatorio."
            )

        if not dias_clase or not dias_clase.strip():
            raise ValidationError(
                "Los días de clase son obligatorios."
            )

        ParaleloService.validar_horario(
            hora_inicio,
            hora_fin
        )

        ParaleloService.validar_cupo(
            cupo_max
        )

        nombre = nombre.strip()
        dias_clase = dias_clase.strip()

        paralelo_existente = Paralelo.objects.filter(
            curso=curso,
            nombre__iexact=nombre
        ).exists()

        if paralelo_existente:
            raise ValidationError(
                "Ya existe un paralelo con ese nombre "
                "en este curso."
            )

        return Paralelo.objects.create(
            curso=curso,
            docente=docente,
            nombre=nombre,
            dias_clase=dias_clase,
            hora_inicio=hora_inicio,
            hora_fin=hora_fin,
            cupo_max=cupo_max
        )

    @staticmethod
    @transaction.atomic
    def actualizar_paralelo(
        paralelo: Paralelo,
        curso: Curso,
        docente: Docente,
        nombre: str,
        dias_clase: str,
        hora_inicio: time,
        hora_fin: time,
        cupo_max: int
    ) -> Paralelo:
        """
        Actualiza un paralelo aplicando
        las reglas de negocio.
        """

        if paralelo is None:
            raise ValidationError(
                "El paralelo no existe."
            )

        if curso is None:
            raise ValidationError(
                "El curso es obligatorio."
            )

        if docente is None:
            raise ValidationError(
                "El docente es obligatorio."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del paralelo es obligatorio."
            )

        if not dias_clase or not dias_clase.strip():
            raise ValidationError(
                "Los días de clase son obligatorios."
            )

        ParaleloService.validar_horario(
            hora_inicio,
            hora_fin
        )

        ParaleloService.validar_cupo(
            cupo_max
        )

        nombre = nombre.strip()
        dias_clase = dias_clase.strip()

        paralelo_existente = Paralelo.objects.filter(
            curso=curso,
            nombre__iexact=nombre
        ).exclude(
            pk=paralelo.pk
        ).exists()

        if paralelo_existente:
            raise ValidationError(
                "Ya existe otro paralelo con ese nombre "
                "en este curso."
            )

        paralelo.curso = curso
        paralelo.docente = docente
        paralelo.nombre = nombre
        paralelo.dias_clase = dias_clase
        paralelo.hora_inicio = hora_inicio
        paralelo.hora_fin = hora_fin
        paralelo.cupo_max = cupo_max

        paralelo.save()

        return paralelo

    @staticmethod
    @transaction.atomic
    def eliminar_paralelo(
        paralelo: Paralelo
    ):
        """
        Elimina un paralelo.
        """

        if paralelo is None:
            raise ValidationError(
                "El paralelo no existe."
            )

        paralelo.delete()
