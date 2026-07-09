from ..academia.Academia import Academia
from django.db import models


class Curso(models.Model):

    academia = models.ForeignKey(
        Academia,
        on_delete=models.CASCADE,
        related_name="cursos"
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