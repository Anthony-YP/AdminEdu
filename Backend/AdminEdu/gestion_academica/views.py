from rest_framework import viewsets, permissions
from gestion_academica.models.core.Core import *
from gestion_academica.models.persona.Persona import *
from gestion_academica.models.academia.Academia import *
from gestion_academica.models.matricula.Matricula import *
from gestion_academica.models.pagos.Pagos import *
from gestion_academica.models.notificaciones.Notificacion import *
from gestion_academica.api.serializers import *
from usuarios.permissions import (
    EsDirector,
    EsSecretaria,
    EsDocente,
    EsEstudiante,
    EsRepresentante,
    EsAdministrativo,
    EsPersonalInstitucion,
    EsDirectorOSuperuser,
)

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [permissions.IsAuthenticated()]

class AcademiaViewSet(viewsets.ModelViewSet):
    queryset = Academia.objects.all()
    serializer_class = AcademiaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsDirector()]
        return [permissions.IsAuthenticated()]

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsDirector()]
        return [permissions.IsAuthenticated()]


class ParaleloViewSet(viewsets.ModelViewSet):
    queryset = Paralelo.objects.all()
    serializer_class = ParaleloSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [permissions.IsAuthenticated()]

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [EsPersonalInstitucion()]

class DirectorViewSet(viewsets.ModelViewSet):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsDirectorOSuperuser()]
        return [EsAdministrativo()]

class DocenteViewSet(viewsets.ModelViewSet):
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [EsPersonalInstitucion()]

class SecretariaViewSet(viewsets.ModelViewSet):
    queryset = Secretaria.objects.all()
    serializer_class = SecretariaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsDirector()]
        return [EsAdministrativo()]

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [EsPersonalInstitucion()]

class RepresentanteViewSet(viewsets.ModelViewSet):
    queryset = Representante.objects.all()
    serializer_class = RepresentanteSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [EsPersonalInstitucion()]

class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [EsPersonalInstitucion()]

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsPersonalInstitucion()]
        return [EsPersonalInstitucion()]

class CalificacionFinalViewSet(viewsets.ModelViewSet):
    queryset = CalificacionFinal.objects.all()
    serializer_class = CalificacionFinalSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsDocente()]
        return [EsPersonalInstitucion()]

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdministrativo()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """Cada usuario solo ve sus propias notificaciones"""
        user = self.request.user
        if user.is_authenticated:
            return Notificacion.objects.filter(usuario=user)
        return Notificacion.objects.none()

class ComprobantePagoViewSet(viewsets.ModelViewSet):
    queryset = ComprobantePago.objects.all()
    serializer_class = ComprobantePagoSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [EsAdministrativo()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [EsDirector()]
        return [permissions.IsAuthenticated()]


