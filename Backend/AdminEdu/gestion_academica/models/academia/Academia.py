from ..core.Direccion import Direccion
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