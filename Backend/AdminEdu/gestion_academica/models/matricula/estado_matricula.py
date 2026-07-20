from django.db import models

class EstadoMatricula(models.TextChoices):
    PENDIENTE = "Pendiente"
    APROBADA = "Aprobada"
    RECHAZADA = "Rechazada"
    FINALIZADA = "Finalizada"