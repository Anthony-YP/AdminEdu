from gestion_academica.models.academia.Academia import Academia
from gestion_academica.models.academia.Curso import Curso
from gestion_academica.models.academia.Paralelo import Paralelo
from gestion_academica.models.core.Direccion import Direccion
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

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'