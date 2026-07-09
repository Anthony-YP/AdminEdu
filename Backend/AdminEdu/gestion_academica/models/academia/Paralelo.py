from django.db import models
from ..academia.Curso import Curso
from ..academia.estado import Estado


class Paralelo(models.Model):

    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="paralelos"
    )

    nombre = models.CharField(max_length=20)
    dias_clase = models.CharField(max_length=50)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    cupo_max = models.PositiveIntegerField()

    estado = models.CharField(
        max_length=10,
        choices=Estado.choices,
        default=Estado.ACTIVO
    )

    def __str__(self):
        return f"{self.curso.nombre} - {self.nombre}"

    class Meta:
        db_table = "paralelo"