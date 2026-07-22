from django.db import models

class Direccion(models.Model):
    ciudad = models.CharField(max_length=25)
    calle_principal = models.CharField(max_length=50)
    calle_secundaria = models.CharField(max_length=50)
    numero_casa = models.CharField(max_length=10, blank=True, null=True)
    referencia = models.TextField(blank=True, null=True)

    def __str__(self):
        direccion = f"{self.calle_principal, self.calle_secundaria}"

        if self.numero_casa:
            direccion += f" N° {self.numero_casa}"

        return direccion

    class Meta:
        db_table = "direccion"
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"
