from django.contrib.auth.models import AbstractUser


# Nombres constantes de los grupos (roles)
GRUPO_ADMINISTRADOR = "Administrador"
GRUPO_DIRECTOR = "Director"
GRUPO_SECRETARIA = "Secretaria"
GRUPO_DOCENTE = "Docente"
GRUPO_ESTUDIANTE = "Estudiante"
GRUPO_REPRESENTANTE = "Representante"
GRUPO_ASPIRANTE = "Aspirante"

GRUPOS_DISPONIBLES = [
    GRUPO_ADMINISTRADOR,
    GRUPO_DIRECTOR,
    GRUPO_SECRETARIA,
    GRUPO_DOCENTE,
    GRUPO_ESTUDIANTE,
    GRUPO_REPRESENTANTE,
    GRUPO_ASPIRANTE,
]


class Usuario(AbstractUser):

    class Meta:
        db_table = "usuario"

    @property
    def grupos_nombres(self):
        """Retorna la lista de nombres de grupos a los que pertenece el usuario"""
        return list(self.groups.values_list('name', flat=True))

    def __str__(self):
        return self.username
