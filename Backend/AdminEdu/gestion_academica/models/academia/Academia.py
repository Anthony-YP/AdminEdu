from ..persona.Persona import Docente
from .estado_curso import EstadoCurso
from .estado_paralelo import EstadoParalelo
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
        related_name="cursos",
    )

    nombre = models.CharField(max_length=100)

    descripcion = models.TextField(
            default="",
            blank=True
    )

    imagen = models.ImageField(
        upload_to="cursos/",
        blank=True,
        null=True,
    )

    precio = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    fecha_inicio = models.DateField()

    fecha_fin = models.DateField()

    estado = models.CharField(
        max_length=15,
        choices=EstadoCurso.choices,
        default=EstadoCurso.ACTIVO,
    )

    def __str__(self):
        return (
            f"{self.nombre} | "
            f"${self.precio} | "
            f"{self.fecha_inicio} - {self.fecha_fin}"
            f"{self.nombre} ({self.academia.nombre})"
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
        related_name="paralelos",
        null=True,
        blank=True,
    )

    nombre = models.CharField(max_length=20)
    dias_clase = models.JSONField(default=list)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    cupo_max = models.PositiveIntegerField()

    estado = models.CharField(
        max_length=15,
        choices=EstadoParalelo.choices,
        default=EstadoParalelo.ACTIVO
    )

    def __str__(self):
        return f"{self.curso.nombre} - {self.nombre}"

    class Meta:
        db_table = "paralelo"
        verbose_name = "Paralelo"
        verbose_name_plural = "Paralelos"