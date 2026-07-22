from django.db import models

class EstadoCurso(models.TextChoices):
    ACTIVO = "ACTIVO", "Activo"
    DESACTIVADO = "DESACTIVADO", "Desactivado"
    CERRADO = "CERRADO", "Cerrado"