from rest_framework.routers import DefaultRouter

from gestion_academica.views.AcademiaViewSet import AcademiaViewSet
from gestion_academica.views.CursoViewSet import CursoViewSet
from gestion_academica.views.ParaleloViewSet import ParaleloViewSet
router = DefaultRouter()

router.register('academias', AcademiaViewSet, basename='academias')
router.register('cursos', CursoViewSet, basename='cursos')
router.register('paralelos', ParaleloViewSet, basename='paralelos')


urlpatterns = router.urls