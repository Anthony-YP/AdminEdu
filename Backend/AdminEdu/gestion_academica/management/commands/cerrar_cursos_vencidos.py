from django.core.management.base import BaseCommand
from django.utils import timezone

from gestion_academica.models.academia.Academia import Curso
from gestion_academica.models.academia.estado_curso import EstadoCurso
from gestion_academica.services.CursoService import CursoService


class Command(BaseCommand):
    """
    RF20: cierra los cursos cuya fecha de fin ya pasó.

    Antes esto solo ocurría de forma perezosa cuando alguien listaba los
    cursos (CursoService.listar_cursos). Este comando permite programarlo
    como tarea recurrente (cron / Programador de tareas de Windows) para
    que el cierre sea puntual aunque nadie consulte el listado ese día:

        python manage.py cerrar_cursos_vencidos
    """

    help = "Cierra automáticamente los cursos cuya fecha de fin ya pasó (RF20)."

    def handle(self, *args, **options):
        pendientes = Curso.objects.filter(
            fecha_fin__lt=timezone.now().date()
        ).exclude(
            estado=EstadoCurso.CERRADO
        ).count()

        CursoService.cerrar_cursos_vencidos()

        self.stdout.write(
            self.style.SUCCESS(f"Cursos cerrados por vencimiento: {pendientes}")
        )
