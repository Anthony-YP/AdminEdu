from django.db import models

class Tipo_documento(models.TextChoices):
    CEDULA = "CEDULA", "Cédula"
    PASAPORTE = "PASAPORTE", "Pasaporte"