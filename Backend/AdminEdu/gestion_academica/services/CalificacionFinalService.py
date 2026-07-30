from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from ..models.matricula.Matricula import CalificacionFinal
from ..models.matricula.Matricula import Matricula
from ..models.matricula.estado_matricula import EstadoMatricula
from .MatriculaService import MatriculaService


class CalificacionFinalService:

    NOTA_MINIMA = Decimal("0.00")

    NOTA_MAXIMA = Decimal("10.00")

    NOTA_APROBACION = Decimal("7.00")

    @staticmethod
    def validar_nota(
        nota_final
    ):

        if nota_final < (
            CalificacionFinalService.NOTA_MINIMA
        ):

            raise ValidationError(
                "La nota final no puede ser "
                "menor a 0."
            )

        if nota_final > (
            CalificacionFinalService.NOTA_MAXIMA
        ):

            raise ValidationError(
                "La nota final no puede ser "
                "mayor a 10."
            )

    @staticmethod
    def calcular_aprobado(
        nota_final
    ):

        return (
            nota_final
            >= CalificacionFinalService.NOTA_APROBACION
        )

    @staticmethod
    def validar_matricula(
        matricula
    ):

        if matricula.estado != (
            EstadoMatricula.APROBADA
        ):

            raise ValidationError(
                "Solo se puede registrar una "
                "calificación final para una "
                "matrícula aprobada."
            )

    @staticmethod
    def validar_docente(
        matricula,
        docente
    ):

        docente_paralelo = (
            matricula
            .paralelo_matricula
            .docente
        )

        if docente_paralelo != docente:

            raise ValidationError(
                "El docente no puede registrar "
                "la calificación final de esta "
                "matrícula."
            )

    @staticmethod
    @transaction.atomic
    def registrar_calificacion(
        matricula,
        docente,
        nota_final
    ):

        CalificacionFinalService.validar_matricula(
            matricula
        )

        CalificacionFinalService.validar_docente(
            matricula,
            docente
        )

        CalificacionFinalService.validar_nota(
            nota_final
        )

        aprobado = (
            CalificacionFinalService
            .calcular_aprobado(
                nota_final
            )
        )

        calificacion = (
            CalificacionFinal.objects.create(
                nota_final=nota_final,
                aprobado=aprobado,
                fecha_registro=(
                    timezone.now().date()
                )
            )
        )

        matricula.calificacion_final = (
            calificacion
        )

        matricula.save(
            update_fields=[
                "calificacion_final"
            ]
        )

        MatriculaService.culminar_matricula(
            matricula
        )

        return calificacion

    @staticmethod
    @transaction.atomic
    def actualizar_calificacion(
        matricula,
        docente,
        nota_final
    ):

        if not matricula.calificacion_final:

            raise ValidationError(
                "La matrícula no tiene una "
                "calificación final registrada."
            )

        CalificacionFinalService.validar_docente(
            matricula,
            docente
        )

        CalificacionFinalService.validar_nota(
            nota_final
        )

        aprobado = (
            CalificacionFinalService
            .calcular_aprobado(
                nota_final
            )
        )

        calificacion = (
            matricula.calificacion_final
        )

        calificacion.nota_final = (
            nota_final
        )

        calificacion.aprobado = (
            aprobado
        )

        calificacion.save(
            update_fields=[
                "nota_final",
                "aprobado"
            ]
        )

        return calificacion