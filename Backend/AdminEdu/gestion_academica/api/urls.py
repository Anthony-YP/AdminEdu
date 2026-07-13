from rest_framework.routers import DefaultRouter
from gestion_academica.views import *

router = DefaultRouter()
router.register('Direccion', DireccionViewSet, basename='direccion')
router.register('academia', AcademiaViewSet, basename='academia')
router.register('curso', CursoViewSet, basename='curso')
router.register('paralelo', ParaleloViewSet, basename='paralelo')
router.register('persona', PersonaViewSet, basename='persona')
router.register('director', DirectorViewSet, basename='director')
router.register('docente', DocenteViewSet, basename='docente')
router.register('secretaria', SecretariaViewSet, basename='secretaria')
router.register('estudiante', EstudianteViewSet, basename='estudiante')
router.register('representante', RepresentanteViewSet, basename='representante')
router.register('matricula', MatriculaViewSet, basename='matricula')
router.register('asistencia', AsistenciaViewSet, basename='asistencia')
router.register('calificacion', CalificacionFinalViewSet, basename='calificacion')
router.register('notificacion', NotificacionViewSet, basename='notificacion')



urlpatterns = router.urls