from django.db import models
from usuarios.models import Usuario

class Notificacion(models.Model):

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="notificaciones"
    )
    mensaje = models.CharField(max_length=255)
    fecha = models.DateTimeField()

    class Meta:
        db_table = "notificacion"
        ordering = ["-fecha"]

    def __str__(self):
        return f"{self.usuario.username} - {self.fecha}"