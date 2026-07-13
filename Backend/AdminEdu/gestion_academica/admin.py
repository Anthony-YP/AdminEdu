from django.contrib import admin

from .models.core.Core import *
from .models.academia.Academia import *
from .models.persona.Persona import *
from .models.matricula.Matricula import *
from .models.notificaciones.Notificacion import *
from .models.pagos.Pagos import *

admin.site.register(Direccion)
admin.site.register(Academia)
admin.site.register(Curso)
admin.site.register(Paralelo)
admin.site.register(Persona)
admin.site.register(Director)
admin.site.register(Docente)
admin.site.register(Secretaria)
admin.site.register(Estudiante)
admin.site.register(Representante)
admin.site.register(Matricula)
admin.site.register(Asistencia)
admin.site.register(CalificacionFinal)
admin.site.register(Notificacion)
admin.site.register(ComprobantePago)