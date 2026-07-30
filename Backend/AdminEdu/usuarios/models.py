from django.contrib.auth.models import AbstractUser


# Nombres constantes de los grupos (roles)
GRUPO_ADMINISTRADOR = "Administrador"
GRUPO_DIRECTOR = "Director"
GRUPO_SECRETARIA = "Secretaria"
GRUPO_DOCENTE = "Docente"
GRUPO_ESTUDIANTE = "Estudiante"
GRUPO_REPRESENTANTE = "Representante"

GRUPOS_DISPONIBLES = [
    GRUPO_ADMINISTRADOR,
    GRUPO_DIRECTOR,
    GRUPO_SECRETARIA,
    GRUPO_DOCENTE,
    GRUPO_ESTUDIANTE,
    GRUPO_REPRESENTANTE,
]


class Usuario(AbstractUser):

    class Meta:
        db_table = "usuario"

    def __str__(self):
        return self.username
