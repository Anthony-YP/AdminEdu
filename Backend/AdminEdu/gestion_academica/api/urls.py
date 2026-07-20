from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from gestion_academica.views.AcademiaViewSet import AcademiaViewSet
from gestion_academica.views.CursoViewSet import CursoViewSet
from gestion_academica.views.ParaleloViewSet import ParaleloViewSet
from gestion_academica.views.MatriculaViewSet import MatriculaViewSet
from gestion_academica.views.DocenteViewSet import DocenteViewSet

router = DefaultRouter()

router.register('academias', AcademiaViewSet, basename='academias')
router.register('cursos', CursoViewSet, basename='cursos')
router.register('paralelos', ParaleloViewSet, basename='paralelos')
router.register("matriculas", MatriculaViewSet, basename="matriculas")
router.register("docentes", DocenteViewSet, basename="docentes")


urlpatterns = router.urls
path('admin/', admin.site.urls),
path('api/', include('usuarios.urls')),
