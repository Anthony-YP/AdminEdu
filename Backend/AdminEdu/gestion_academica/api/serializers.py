from gestion_academica.models.academia.Academia import Academia, Curso, Paralelo
from gestion_academica.models.persona.Persona import (Director, Docente, Secretaria, Estudiante,
                                                      Representante)
from gestion_academica.models.matricula.Matricula import Matricula, Asistencia, CalificacionFinal
from gestion_academica.models.notificaciones.Notificacion import Notificacion

from rest_framework import serializers


class AcademiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Academia
        fields = '__all__'

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'

class ParaleloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paralelo
        fields = '__all__'


class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = '__all__'

class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = '__all__'

class SecretariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secretaria
        fields = '__all__'

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'

class RepresentanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Representante
        fields = '__all__'

class MatriculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matricula
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = '__all__'

class Calificacion_finalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionFinal
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'