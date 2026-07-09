from gestion_academica.models.academia.Academia import Academia
from gestion_academica.models.academia.Curso import Curso
from gestion_academica.models.academia.Paralelo import Paralelo
from gestion_academica.api.serializers import AcademiaSerializer, CursoSerializer, ParaleloSerializer
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