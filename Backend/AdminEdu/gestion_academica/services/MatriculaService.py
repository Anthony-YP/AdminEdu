from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from ..models.matricula.Matricula import Matricula
from ..models.matricula.estado_matricula import EstadoMatricula
from ..models.notificaciones.Notificacion import Notificacion


def _notificar_estudiante(matricula, mensaje):

    usuario = matricula.estudiante.usuario

    if usuario is None:
        return

    Notificacion.objects.create(usuario=usuario, mensaje=mensaje)


class MatriculaService:

    @staticmethod
    def validar_paralelo_activo(paralelo):

        if paralelo.estado != "ACTIVO":

            raise ValidationError(
                "No se puede realizar la matrícula "
                "porque el paralelo actualmente se encuentra inactivo."
            )

    @staticmethod
    def validar_cupo(paralelo):

        matriculas_ocupando_cupo = Matricula.objects.filter(
            paralelo_matricula=paralelo,
            estado__in=[
                EstadoMatricula.PENDIENTE,
                EstadoMatricula.APROBADA
            ]
        ).count()

        if matriculas_ocupando_cupo >= paralelo.cupo_max:

            raise ValidationError(
                "El paralelo no tiene cupos disponibles."
            )

    @staticmethod
    def validar_matricula_duplicada(
        estudiante,
        paralelo
    ):

        curso = paralelo.curso

        matricula_existente = Matricula.objects.filter(
            estudiante=estudiante,
            paralelo_matricula__curso=curso
        ).exclude(
            estado=EstadoMatricula.RECHAZADA
        ).exists()

        if matricula_existente:

            raise ValidationError(
                "El estudiante ya cuenta con una matrícula "
                "registrada en este curso."
            )

    @staticmethod
    @transaction.atomic
    def solicitar_matricula(
        estudiante,
        paralelo,
        comprobante_pago
    ):

        if comprobante_pago is None:

            raise ValidationError(
                "Debe adjuntar el comprobante de pago "
                "para solicitar la matrícula."
            )

        MatriculaService.validar_paralelo_activo(
            paralelo
        )

        MatriculaService.validar_cupo(
            paralelo
        )

        MatriculaService.validar_matricula_duplicada(
            estudiante,
            paralelo
        )

        matricula = Matricula.objects.create(
            estudiante=estudiante,
            paralelo_matricula=paralelo,
            comprobante_pago=comprobante_pago,
            fecha_solicitud=timezone.now().date(),
            estado=EstadoMatricula.PENDIENTE
        )

        return matricula

    @staticmethod
    @transaction.atomic
    def aprobar_matricula(matricula):

        if matricula.estado != EstadoMatricula.PENDIENTE:

            raise ValidationError(
                "Solo se pueden aprobar matrículas "
                "que se encuentren pendientes."
            )

        MatriculaService.validar_cupo(
            matricula.paralelo_matricula
        )

        matricula.estado = EstadoMatricula.APROBADA

        matricula.fecha_aprobacion = (
            timezone.now().date()
        )

        matricula.save(
            update_fields=[
                "estado",
                "fecha_aprobacion"
            ]
        )

        _notificar_estudiante(
            matricula,
            f"Tu matrícula en {matricula.paralelo_matricula.curso.nombre} "
            f"({matricula.paralelo_matricula.nombre}) fue aprobada.",
        )

        return matricula

    @staticmethod
    @transaction.atomic
    def rechazar_matricula(matricula, comentario):

        if matricula.estado != EstadoMatricula.PENDIENTE:

            raise ValidationError(
                "Solo se pueden rechazar matrículas "
                "que se encuentren pendientes."
            )
        if not comentario or not comentario.strip():
            raise ValidationError(
            "Debe ingresar el motivo por el cuál se rechaza la matricula")

        matricula.estado = EstadoMatricula.RECHAZADA
        matricula.comentario = comentario

        matricula.save(
            update_fields=[
                "estado",
                "comentario",
            ]
        )

        _notificar_estudiante(
            matricula,
            f"Tu matrícula en {matricula.paralelo_matricula.curso.nombre} "
            f"({matricula.paralelo_matricula.nombre}) fue rechazada: {comentario}",
        )

        return matricula

    @staticmethod
    @transaction.atomic
    def cancelar_matricula(matricula, comentario):

        if matricula.estado not in (
            EstadoMatricula.PENDIENTE,
            EstadoMatricula.APROBADA,
        ):
            raise ValidationError(
                "Solo se pueden cancelar matrículas "
                "pendientes o aprobadas."
            )

        if not comentario or not comentario.strip():
            raise ValidationError(
                "Debe ingresar el motivo por el cuál se cancela la matricula"
            )

        matricula.estado = EstadoMatricula.CANCELADA
        matricula.comentario = comentario

        matricula.save(
            update_fields=[
                "estado",
                "comentario",
            ]
        )

        return matricula

    @staticmethod
    @transaction.atomic
    def reenviar_matricula(
        matricula,
        paralelo,
        tipo_pago,
        monto,
        numero_ref,
        comprobante_archivo=None,
    ):

        if matricula.estado != EstadoMatricula.RECHAZADA:
            raise ValidationError(
                "Solo se pueden reenviar matrículas rechazadas."
            )

        MatriculaService.validar_paralelo_activo(paralelo)

        MatriculaService.validar_cupo(paralelo)

        comprobante = matricula.comprobante_pago
        comprobante.tipo_pago = tipo_pago
        comprobante.monto = monto
        comprobante.numero_ref = numero_ref or None
        comprobante.fecha = timezone.now().date()

        if comprobante_archivo:
            comprobante.tipo_archivo = comprobante_archivo

        comprobante.save()

        matricula.paralelo_matricula = paralelo
        matricula.estado = EstadoMatricula.PENDIENTE
        matricula.fecha_solicitud = timezone.now().date()
        matricula.fecha_aprobacion = None
        matricula.comentario = ""

        matricula.save()

        return matricula

    @staticmethod
    @transaction.atomic
    def crear_matricula_manual(
        estudiante,
        paralelo,
        comprobante_pago
    ):

        if comprobante_pago is None:

            raise ValidationError(
                "Debe registrar un comprobante de pago."
            )

        MatriculaService.validar_paralelo_activo(
            paralelo
        )

        MatriculaService.validar_cupo(
            paralelo
        )

        MatriculaService.validar_matricula_duplicada(
            estudiante,
            paralelo
        )

        fecha_actual = timezone.now().date()

        matricula = Matricula.objects.create(
            estudiante=estudiante,
            paralelo_matricula=paralelo,
            comprobante_pago=comprobante_pago,
            fecha_solicitud=fecha_actual,
            fecha_aprobacion=fecha_actual,
            estado=EstadoMatricula.APROBADA
        )

        return matricula

    @staticmethod
    def listar_pendientes():

        return Matricula.objects.filter(
            estado=EstadoMatricula.PENDIENTE
        ).select_related(
            "estudiante",
            "paralelo_matricula",
            "paralelo_matricula__curso",
            "comprobante_pago"
        ).order_by(
            "-fecha_solicitud"
        )

    @staticmethod
    def listar_matriculas_estudiante(
        estudiante
    ):

        return Matricula.objects.filter(
            estudiante=estudiante
        ).select_related(
            "paralelo_matricula",
            "paralelo_matricula__curso",
            "paralelo_matricula__docente",
            "comprobante_pago",
            "calificacion_final"
        ).order_by(
            "-fecha_solicitud"
        )

    @staticmethod
    def calcular_porcentaje_asistencia(matricula):

        total = matricula.asistencias.count()

        if total == 0:
            return None

        presentes = matricula.asistencias.filter(presente=True).count()

        return round((presentes / total) * 100, 2)

    @staticmethod
    def listar_matriculas_paralelo(
        paralelo
    ):

        return Matricula.objects.filter(
            paralelo_matricula=paralelo,
            estado__in=[EstadoMatricula.APROBADA, EstadoMatricula.FINALIZADA],
        ).select_related(
            "estudiante",
            "paralelo_matricula",
            "paralelo_matricula__curso"
        )

    @staticmethod
    @transaction.atomic
    def culminar_matricula(matricula):

        if matricula.estado != (
                EstadoMatricula.APROBADA
        ):
            raise ValidationError(
                "Solo se puede registrar el resultado "
                "académico de una matrícula aprobada."
            )

        matricula.estado = (
            EstadoMatricula.FINALIZADA
        )

        matricula.save(
            update_fields=[
                "estado"
            ]
        )
        return matricula
