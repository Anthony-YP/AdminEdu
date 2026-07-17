from django.db import models
from datetime import date

from ..core.Core import Direccion
from ..persona.Tipo_documento import Tipo_documento
from usuarios.models import Usuario
from gestion_academica.services.PersonaServices import PersonaService

class Persona(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="persona"
    )
    direccion = models.ForeignKey(
        Direccion,
        on_delete=models.CASCADE,
        related_name="direccion",
    )

    tipo_documento = models.CharField(
        max_length=10,
        choices= Tipo_documento.choices,
        default= Tipo_documento.CEDULA,
    )

    numero_identificacion = models.CharField(max_length=10, unique=True, null= False)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=10, unique=True)
    fecha_nacimiento = models.DateField()

    class Meta:
        db_table = "persona"
        verbose_name = "Persona"
        verbose_name_plural = "Personas"

    @property
    def edad(self):
        hoy = date.today()
        edad = hoy.year - self.fecha_nacimiento.year

        if (hoy.month, hoy.day) < (
            self.fecha_nacimiento.month,
            self.fecha_nacimiento.day,
        ):
            edad -= 1

        return edad
    def clean(self):
        """
        Ejecuta las reglas de negocio antes de guardar una persona.
        """
        PersonaService.validar_persona(self)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

def __str__(self):
    return (
        f"{self.nombres} "
        f"{self.apellidos} "
        f"({self.numero_identificacion})"
    )

"=================================== ADMINISTRACIÓN ====================================================="
class Director(Persona):

    class Meta:
        db_table = "director"
        verbose_name = "Director"
        verbose_name_plural = "Directores"

    def __str__(self):
        return (
            f"{self.nombres} "
            f"{self.apellidos} "
            f"({self.numero_identificacion})"
        )

class Secretaria(Persona):

    class Meta:
        db_table = "secretaria"
        verbose_name = "Secretaria"
        verbose_name_plural = "Secretarias"

    def __str__(self):
        return (
            f"{self.nombres} "
            f"{self.apellidos} "
            f"({self.numero_identificacion})"
        )

"====================================== PERSONAL INSTITUCION ========================================="
class Docente(Persona):

    titulo = models.CharField(max_length=20)
    especialidad = models.CharField(max_length=20)

    class Meta:
        db_table = "docente"
        verbose_name = "Docente"
        verbose_name_plural = "Docentes"

    def __str__(self):
        return (
            f"{self.nombres} "
            f"{self.apellidos} "
            f"({self.numero_identificacion})"
        )

"========================================================================================================"
class Representante(Persona):

    class Meta:
        db_table = "representante"
        verbose_name = "Representante"
        verbose_name_plural = "Representantes"

    def __str__(self):
        return (
            f"{self.nombres} "
            f"{self.apellidos} "
            f"({self.numero_identificacion})"
        )

class Estudiante(Persona):

    representante_legal = models.ForeignKey(
        Representante,
        on_delete=models.CASCADE,
        related_name="estudiantes",
    )

    class Meta:
        db_table = "estudiante"
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"

    def __str__(self):
        return (
            f"{self.nombres} "
            f"{self.apellidos} "
            f"({self.numero_identificacion})"
        )
