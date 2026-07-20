from django.db import models

from ..academia.Academia import Paralelo
from ..matricula.estado_matricula import EstadoMatricula
from ..pagos.Pagos import ComprobantePago
from ..persona.Persona import Estudiante


class CalificacionFinal(models.Model):

    nota_final = models.DecimalField(max_digits=2,decimal_places=2)
    aprobado = models.BooleanField(default=False)
    fecha_registro = models.DateField()

    class Meta:
        db_table = "calificacion_final"
        verbose_name = "calificacion final"
        verbose_name_plural = "calificaciones finales"

    def _str_(self):
        return (
            f"{self.nota_final}"
        )

class Matricula(models.Model):

    estudiante = models.ForeignKey(
        Estudiante,
        on_delete=models.CASCADE,
        related_name="matriculas"
    )

    paralelo_matricula = models.ForeignKey(
        Paralelo,
        on_delete=models.CASCADE,
        related_name="matriculas"
    )

    comprobante_pago = models.OneToOneField(
        ComprobantePago,
        on_delete=models.CASCADE,
        related_name="matricula"
    )

    calificacion_final = models.OneToOneField(
        CalificacionFinal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="calificacion_final"
    )

    fecha_solicitud = models.DateField()
    fecha_aprobacion = models.DateField(null=True,blank=True)
    estado = models.CharField(
        max_length=20,
        choices=EstadoMatricula.choices,
        default=EstadoMatricula.PENDIENTE
    )

    class Meta:
        db_table = "matricula"
        verbose_name = "matricula"
        verbose_name_plural = "Matriculas"

    def _str_(self):
        return (
            f"{self.estudiante.persona.nombre + self.estudiante.persona.apellido} | "
            f"{self.estado} | "
            f"{self.fecha_solicitud} |" 
            f"{self.calificacion_final.CalificacionFinal.nota_final} |"
        )
class Asistencia(models.Model):

    matricula = models.ForeignKey(
        Matricula,
        on_delete=models.CASCADE,
        related_name="asistencias"
    )

    fecha = models.DateField()
    presente = models.BooleanField(default=False)

    def _str_(self):
        return (
            f"{'Presente' if self.presente else 'Ausente'}"
        )

    class Meta:
        db_table = "asistencia"
        verbose_name = "asistencia"
        verbose_name_plural = "Asistencias"