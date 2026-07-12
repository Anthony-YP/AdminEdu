from gestion_academica.models.academia.Academia import Academia, Curso, Paralelo
from gestion_academica.models.persona.Persona import Persona, Director, Docente, Secretaria, Estudiante, Representante
from gestion_academica.api.serializers import *
from rest_framework import viewsets, permissions


class AcademiaViewSet(viewsets.ModelViewSet):
    queryset = Academia.objects.all()
    serializer_class = AcademiaSerializer

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

class ParaleloViewSet(viewsets.ModelViewSet):
    queryset = Paralelo.objects.all()
    serializer_class = ParaleloSerializer

class DirectorViewSet(viewsets.ModelViewSet):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer

class DocenteViewSet(viewsets.ModelViewSet):
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer

class SecretariaViewSet(viewsets.ModelViewSet):
    queryset = Secretaria.objects.all()
    serializer_class = SecretariaSerializer

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

class RepresentanteViewSet(viewsets.ModelViewSet):
    queryset = Representante.objects.all()
    serializer_class = RepresentanteSerializer

class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer

class Calificacion_finalViewSet(viewsets.ModelViewSet):
    queryset = CalificacionFinal.objects.all()
    serializer_class = Calificacion_finalSerializer

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer


