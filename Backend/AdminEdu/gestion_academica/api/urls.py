from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from gestion_academica.views.AcademiaViewSet import AcademiaViewSet
from gestion_academica.views.CursoViewSet import CursoViewSet
from gestion_academica.views.ParaleloViewSet import ParaleloViewSet
from gestion_academica.views.MatriculaViewSet import MatriculaViewSet
from gestion_academica.views.DocenteViewSet import DocenteViewSet
from gestion_academica.views.PersonaViewSet import PersonaViewSet
from gestion_academica.views.EstudianteViewSet import EstudianteViewSet
from gestion_academica.views.DirectorViewSet import DirectorViewSet
from gestion_academica.views.SecretariaViewSet import SecretariaViewSet
from gestion_academica.views.RepresentanteViewSet import RepresentanteViewSet
from gestion_academica.views.NotificacionViewSet import NotificacionViewSet
from gestion_academica.views.AsistenciaViewSet import AsistenciaViewSet
from gestion_academica.views.CalificacionFinalViewSet import CalificacionFinalViewSet
from gestion_academica.views.AspiranteViewSet import (
    AspirantePerfilView,
    AspiranteSolicitudesView,
    AspiranteMatriculaView,
    EstudianteHistorialView,
    PerfilCompletadoView,
)

router = DefaultRouter()

router.register('academias', AcademiaViewSet, basename='academias')
router.register('cursos', CursoViewSet, basename='cursos')
router.register('paralelos', ParaleloViewSet, basename='paralelos')
router.register("matriculas", MatriculaViewSet, basename="matriculas")
router.register("personas",PersonaViewSet,basename="personas")
router.register("estudiantes", EstudianteViewSet, basename="estudiantes")
router.register("docentes", DocenteViewSet, basename="docentes")
router.register("directores", DirectorViewSet, basename="directores")
router.register("secretarias", SecretariaViewSet, basename="secretarias")
router.register("representantes", RepresentanteViewSet, basename="representantes")
router.register("notificaciones", NotificacionViewSet, basename="notificaciones")
router.register("asistencias", AsistenciaViewSet, basename="asistencias")
router.register("calificaciones", CalificacionFinalViewSet, basename="calificaciones")

urlpatterns = router.urls + [
    path("aspirante/perfil/", AspirantePerfilView.as_view(), name="aspirante-perfil"),
    path("aspirante/completar-perfil/", PerfilCompletadoView.as_view(), name="aspirante-completar-perfil"),
    path("aspirante/solicitudes/", AspiranteSolicitudesView.as_view(), name="aspirante-solicitudes"),
    path("aspirante/solicitar-matricula/", AspiranteMatriculaView.as_view(), name="aspirante-solicitar-matricula"),
    path("estudiante/historial/", EstudianteHistorialView.as_view(), name="estudiante-historial"),
]