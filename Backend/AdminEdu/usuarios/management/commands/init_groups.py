"""
Management command para crear los grupos (roles) y permisos por defecto.
Ejecutar: python manage.py init_groups
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from gestion_academica.models.academia.Academia import Academia, Curso, Paralelo
from gestion_academica.models.core.Core import Direccion
from gestion_academica.models.persona.Persona import (
    Persona, Director, Secretaria, Docente, Estudiante, Representante,
)
from gestion_academica.models.matricula.Matricula import Matricula, CalificacionFinal, Asistencia
from gestion_academica.models.notificaciones.Notificacion import Notificacion
from gestion_academica.models.pagos.Pagos import ComprobantePago


MODELOS_REGISTRABLES = [
    Direccion, Academia, Curso, Paralelo,
    Persona, Director, Secretaria, Docente, Estudiante, Representante,
    Matricula, CalificacionFinal, Asistencia,
    Notificacion, ComprobantePago,
]

# Definición de grupos y sus permisos
# add = crear, change = actualizar, delete = eliminar, view = ver
GRUPOS_CONFIG = {
    "Administrador": {
        "permisos": ["add", "change", "delete", "view"],
        "modelos": "__all__",  # Todos los modelos
    },
    "Director": {
        "permisos": ["add", "change", "delete", "view"],
        "modelos": "__all__",  # Todos los modelos
    },
    "Secretaria": {
        "permisos": ["add", "change", "view"],
        "modelos": [
            Direccion, Persona, Estudiante, Representante,
            Matricula, Asistencia, ComprobantePago, Notificacion,
        ],
    },
    "Docente": {
        "permisos": ["add", "change", "view"],
        "modelos": [Asistencia, CalificacionFinal, Notificacion],
    },
    "Estudiante": {
        "permisos": ["view"],
        "modelos": "__all__",
    },
    "Representante": {
        "permisos": ["view"],
        "modelos": [Matricula, CalificacionFinal, ComprobantePago, Notificacion],
    },

    "Aspirante": {
    "permisos": [
        "view",
    ],
    "modelos": [
        Curso,
        Academia,
    ],
    },
}


class Command(BaseCommand):
    help = "Crea los grupos (Administrador, Director, Secretaria, Docente, Estudiante, Representante) y asigna permisos"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Inicializando grupos y permisos...\n")

        for nombre_grupo, config in GRUPOS_CONFIG.items():
            grupo, created = Group.objects.get_or_create(name=nombre_grupo)

            if created:
                self.stdout.write(f"  [+] Grupo '{nombre_grupo}' creado")
            else:
                self.stdout.write(f"  [~] Grupo '{nombre_grupo}' ya existe, actualizando permisos")

            # Limpiar permisos anteriores para actualizarlos
            grupo.permissions.clear()

            # Obtener modelos a los que aplicar permisos
            if config["modelos"] == "__all__":
                modelos = MODELOS_REGISTRABLES
            else:
                modelos = config["modelos"]

            permisos_asignados = 0
            for modelo in modelos:
                content_type = ContentType.objects.get_for_model(modelo)
                nombre_modelo = modelo._meta.model_name

                # Obtener los permisos según la acción (add, change, delete, view)
                for accion in config["permisos"]:
                    codename = f"{accion}_{nombre_modelo}"
                    try:
                        permiso = Permission.objects.get(
                            content_type=content_type,
                            codename=codename,
                        )
                        grupo.permissions.add(permiso)
                        permisos_asignados += 1
                    except Permission.DoesNotExist:
                        self.stdout.write(
                            f"    [!] Permiso '{codename}' no encontrado"
                        )

            self.stdout.write(
                f"    -> {permisos_asignados} permisos asignados al grupo '{nombre_grupo}'\n"
            )

        self.stdout.write(self.style.SUCCESS("✓ Grupos y permisos inicializados correctamente"))