from django.db import models

class Estado(models.TextChoices):
    ACTIVO = "Activo"
    INACTIVO = "Inactivo"