from ..persona.Persona import Docente
from .estado import Estado
from ..core.Core import Direccion
from django.db import models


class Academia(models.Model):
    nombre = models.CharField(max_length=100,unique=True)
    telefono = models.CharField(max_length=10)

    direccion = models.OneToOneField(
        Direccion,
        on_delete=models.CASCADE,
        related_name="academia",
    )

    def __str__(self):
        return f"{self.nombre} - {self.direccion.ciudad} - {self.direccion.calle_principal}"

    class Meta:
        db_table = "academia"

class Curso(models.Model):

    academia = models.ForeignKey(
        Academia,
        on_delete=models.CASCADE,
        related_name="cursos"
    )

    docente = models.ForeignKey(
        Docente,
        on_delete=models.PROTECT,
        related_name="paralelos"
    )

    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=8,decimal_places=2)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()


    def __str__(self):
        return (
            f"{self.nombre} | "
            f"${self.precio} | "
            f"{self.fecha_inicio} - {self.fecha_fin}"
        )

    class Meta:
        db_table = "curso"

class Paralelo(models.Model):

    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="paralelos"
    )

    docente = models.ForeignKey(
        Docente,
        on_delete=models.PROTECT,
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
        verbose_name = "Paralelo"
        verbose_name_plural = "Paralelos"