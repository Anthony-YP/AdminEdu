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

from gestion_academica.models.academia.estado_paralelo import EstadoParalelo
from gestion_academica.models.academia.estado_curso import EstadoCurso
from gestion_academica.models.notificaciones.Notificacion import Notificacion


def _notificar_docente_asignado(paralelo):

    if paralelo.docente is None or paralelo.docente.usuario is None:
        return

    Notificacion.objects.create(
        usuario=paralelo.docente.usuario,
        mensaje=(
            f"Se le ha asignado el paralelo {paralelo.nombre} "
            f"del curso {paralelo.curso.nombre}."
        ),
    )


class ParaleloService:

    @staticmethod
    def validar_horario(
        hora_inicio: time,
        hora_fin: time
    ):

        if hora_inicio >= hora_fin:
            raise ValidationError(
                "La hora de inicio debe ser anterior "
                "a la hora de finalización."
            )

    @staticmethod
    def validar_cupo(
        cupo_max: int
    ):

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
    def validar_dias_clase(dias_clase):

        if not dias_clase or not isinstance(dias_clase, list):
            raise ValidationError(
                "Los días de clase son obligatorios y deben "
                "ser una lista de días."
            )

    @staticmethod
    @transaction.atomic
    def crear_paralelo(
        curso: Curso,
        docente: Docente,
        nombre: str,
        dias_clase,
        hora_inicio: time,
        hora_fin: time,
        cupo_max: int
    ) -> Paralelo:

        if curso is None:
            raise ValidationError(
                "El curso es obligatorio."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del paralelo es obligatorio."
            )

        ParaleloService.validar_dias_clase(dias_clase)

        ParaleloService.validar_horario(
            hora_inicio,
            hora_fin
        )

        ParaleloService.validar_cupo(
            cupo_max
        )

        nombre = nombre.strip()

        paralelo_existente = Paralelo.objects.filter(
            curso=curso,
            nombre__iexact=nombre
        ).exists()

        if paralelo_existente:
            raise ValidationError(
                "Ya existe un paralelo con ese nombre "
                "en este curso."
            )

        paralelo = Paralelo.objects.create(
            curso=curso,
            docente=docente,
            nombre=nombre,
            dias_clase=dias_clase,
            hora_inicio=hora_inicio,
            hora_fin=hora_fin,
            cupo_max=cupo_max
        )

        if docente is not None:
            _notificar_docente_asignado(paralelo)

        return paralelo

    @staticmethod
    @transaction.atomic
    def actualizar_paralelo(
        paralelo: Paralelo,
        curso: Curso,
        docente: Docente,
        nombre: str,
        dias_clase,
        hora_inicio: time,
        hora_fin: time,
        cupo_max: int
    ) -> Paralelo:

        if paralelo is None:
            raise ValidationError(
                "El paralelo no existe."
            )

        if curso is None:
            raise ValidationError(
                "El curso es obligatorio."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del paralelo es obligatorio."
            )

        ParaleloService.validar_dias_clase(dias_clase)

        ParaleloService.validar_horario(
            hora_inicio,
            hora_fin
        )

        ParaleloService.validar_cupo(
            cupo_max
        )

        nombre = nombre.strip()

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

        docente_anterior_id = paralelo.docente_id

        paralelo.curso = curso
        paralelo.docente = docente
        paralelo.nombre = nombre
        paralelo.dias_clase = dias_clase
        paralelo.hora_inicio = hora_inicio
        paralelo.hora_fin = hora_fin
        paralelo.cupo_max = cupo_max

        paralelo.save()

        if docente is not None and docente.pk != docente_anterior_id:
            _notificar_docente_asignado(paralelo)

        return paralelo

    @staticmethod
    @transaction.atomic
    def cambiar_estado(paralelo: Paralelo, nuevo_estado: str) -> Paralelo:

        if paralelo is None:
            raise ValidationError(
                "El paralelo no existe."
            )

        if nuevo_estado not in EstadoParalelo.values:
            raise ValidationError(
                "El estado indicado no es válido."
            )

        if paralelo.curso.estado == EstadoCurso.CERRADO:
            raise ValidationError(
                "El curso de este paralelo está cerrado; el paralelo "
                "quedó desactivado permanentemente."
            )

        paralelo.estado = nuevo_estado
        paralelo.save(update_fields=["estado"])

        return paralelo

    @staticmethod
    @transaction.atomic
    def eliminar_paralelo(
        paralelo: Paralelo
    ):


        if paralelo is None:
            raise ValidationError(
                "El paralelo no existe."
            )

        return ParaleloService.cambiar_estado(paralelo, EstadoParalelo.DESACTIVADO)