from django.contrib import admin

from .models.academia.Academia import Academia, Curso, Paralelo
from .models.persona.Persona import Director, Docente, Secretaria, Estudiante, Representante
from .models.matricula.Matricula import Matricula, Asistencia, CalificacionFinal
from .models.notificaciones.Notificacion import Notificacion

admin.site.register(Academia)
admin.site.register(Curso)
admin.site.register(Paralelo)
admin.site.register(Director)
admin.site.register(Docente)
admin.site.register(Secretaria)
admin.site.register(Estudiante)
admin.site.register(Representante)
admin.site.register(Matricula)
admin.site.register(Asistencia)
admin.site.register(CalificacionFinal)
admin.site.register(Notificacion)