from django.contrib import admin

from .models.core.Core import *
from .models.academia.Academia import *
from django.utils.html import format_html
from .models.persona.Persona import *
from .models.matricula.Matricula import *
from .models.notificaciones.Notificacion import *
from .models.pagos.Pagos import *
from .services.PersonaService import PersonaService

admin.site.register(Direccion)


@admin.register(Academia)
class AcademiaAdmin(admin.ModelAdmin):

    list_display = (
        "nombre",
        "telefono",
        "direccion",
    )

    search_fields = (
        "nombre",
        "telefono",
    )

    ordering = (
        "nombre",
    )

@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):

    list_display = (
        "nombre",
        "academia",
        "precio",
        "fecha_inicio",
        "fecha_fin",
        "mostrar_imagen",
    )

    list_filter = (
        "academia",
        "fecha_inicio",
    )

    search_fields = (
        "nombre",
        "academia__nombre",
    )

    ordering = (
        "academia",
        "nombre",
    )

    readonly_fields = (
        "preview_imagen",
    )

    fieldsets = (

        (
            "Información General",
            {
                "fields": (
                    "academia",
                    "nombre",
                    "descripcion",
                )
            },
        ),

        (
            "Imagen",
            {
                "fields": (
                    "imagen",
                    "preview_imagen",
                )
            },
        ),

        (
            "Información Académica",
            {
                "fields": (
                    "precio",
                    "fecha_inicio",
                    "fecha_fin",
                )
            },
        ),
    )

    def mostrar_imagen(self, obj):

        if obj.imagen:
            return "✔"

        return "—"

    mostrar_imagen.short_description = "Imagen"

    def preview_imagen(self, obj):

        if obj.imagen:

            return format_html(
                '<img src="{}" width="250" style="border-radius:10px;" />',
                obj.imagen.url,
            )

        return "No existe imagen."

    preview_imagen.short_description = "Vista previa"

admin.site.register(Paralelo)
#admin.site.register(Persona)
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

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):

    list_display = (
        "nombres",
        "apellidos",
        "correo",
        "telefono",
        "tipo_documento",
        "numero_identificacion",
    )

    search_fields = (
        "nombres",
        "apellidos",
        "correo",
        "numero_identificacion",
    )

    list_filter = (
        "tipo_documento",
    )

    ordering = (
        "apellidos",
        "nombres",
    )

    list_per_page = 20