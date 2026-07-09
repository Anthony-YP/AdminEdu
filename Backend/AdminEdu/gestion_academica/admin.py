from django.contrib import admin

from .models.academia.Academia import Academia
from .models.academia.Curso import Curso
from .models.academia.Paralelo import Paralelo
from .models.core.Direccion import Direccion

admin.site.register(Academia)
admin.site.register(Curso)
admin.site.register(Paralelo)
admin.site.register(Direccion)