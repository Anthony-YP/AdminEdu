from rest_framework.routers import DefaultRouter
from gestion_academica.views import AcademiaViewSet, CursoViewSet, ParaleloViewSet

router = DefaultRouter()
router.register('academia', AcademiaViewSet, basename='academia')
router.register('curso', CursoViewSet, basename='curso')
router.register('paralelo', ParaleloViewSet, basename='paralelo')


urlpatterns = router.urls