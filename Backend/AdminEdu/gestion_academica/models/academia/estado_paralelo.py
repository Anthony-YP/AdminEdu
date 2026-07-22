from django.db import models

class EstadoParalelo(models.TextChoices):
    ACTIVO = "ACTIVO", "Activo"
    DESACTIVADO = "DESACTIVADO", "Desactivado"