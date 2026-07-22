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

urlpatterns = router.urls