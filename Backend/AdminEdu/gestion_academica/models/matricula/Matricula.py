from django.db import models

from ..matricula.estado_matricula import EstadoMatricula
from ..pagos.Pagos import ComprobantePago
from ..persona.Persona import Estudiante, Secretaria, Docente


class Matricula(models.Model):

    estudiante = models.ForeignKey(
        Estudiante,
        on_delete=models.CASCADE,
        related_name="matriculas"
    )

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="matriculas_gestionadas"
    )

    comprobante_pago = models.OneToOneField(
        ComprobantePago,
        on_delete=models.CASCADE,
        related_name="matricula"
    )

    fecha_solicitud = models.DateField()

    fecha_aprobacion = models.DateField(
        null=True,
        blank=True
    )

    estado = models.CharField(
        max_length=20,
        choices=EstadoMatricula.choices,
        default=EstadoMatricula.PENDIENTE
    )

    class Meta:
        db_table = "matricula"

    def _str_(self):
        return (
            f"{self.estudiante} | "
            f"{self.estado} | "
            f"{self.fecha_solicitud}"
        )


class Asistencia(models.Model):

    matricula = models.ForeignKey(
        Matricula,
        on_delete=models.CASCADE,
        related_name="asistencias"
    )

    docente = models.ForeignKey(
        Docente,
        on_delete=models.CASCADE,
        related_name="asistencias"
    )

    fecha = models.DateField()

    presente = models.BooleanField(default=False)

    def _str_(self):
        return (
            f"{self.matricula} | "
            f"{self.fecha} | "
            f"{'Presente' if self.presente else 'Ausente'}"
        )

    class Meta:
        db_table = "asistencia"

class CalificacionFinal(models.Model):

    matricula = models.OneToOneField(
        Matricula,
        on_delete=models.CASCADE,
        related_name="calificacion_final"
    )

    docente = models.OneToOneField(
        Docente,
        on_delete=models.CASCADE,
        related_name="calificaciones_finales"
    )

    nota_final = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    aprobado = models.BooleanField(default=False)

    fecha_registro = models.DateField()

    class Meta:
        db_table = "calificacion_final"

    def _str_(self):
        return (
            f"{self.matricula} | "
            f"{self.nota_final}"
        )