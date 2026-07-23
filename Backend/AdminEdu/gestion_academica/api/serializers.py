from gestion_academica.models.core.Core import *
from gestion_academica.models.academia.Academia import *
from gestion_academica.models.persona.Persona import *
from gestion_academica.models.matricula.Matricula import *
from gestion_academica.models.notificaciones.Notificacion import *
from gestion_academica.models.pagos.Pagos import *
from django.contrib.auth.models import User, Group
from rest_framework import serializers

from rest_framework import serializers


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class AcademiaSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer(read_only=True)
    class Meta:
        model = Academia
        fields = ['id', 'nombre', 'telefono', 'direccion']

class ParaleloBasicoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    docente_nombre = serializers.SerializerMethodField()
    dias_clase = serializers.CharField()
    hora_inicio = serializers.TimeField()
    hora_fin = serializers.TimeField()
    cupo_max = serializers.IntegerField()
    estado = serializers.CharField()

    def get_docente_nombre(self, obj):
        if hasattr(obj, 'docente') and obj.docente:
            return f"{obj.docente.nombres} {obj.docente.apellidos}"
        return "Sin asignar"


class CursoSerializer(serializers.ModelSerializer):

    academia_nombre = serializers.CharField(
        source="academia.nombre",
        read_only=True
    )

    imagen = serializers.SerializerMethodField()
    paralelos = serializers.SerializerMethodField()

    class Meta:

        model = Curso

        fields = [
            "id",
            "academia",
            "academia_nombre",
            "nombre",
            "descripcion",
            "imagen",
            "precio",
            "fecha_inicio",
            "fecha_fin",
            "paralelos",
        ]


    def get_imagen(self, obj):

        if not obj.imagen:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.imagen.url
            )

        return obj.imagen.url

    def get_paralelos(self, obj):
        paralelos = obj.paralelos.all()
        return ParaleloBasicoSerializer(paralelos, many=True).data

class ParaleloSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Paralelo
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
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

class RepresentanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Representante
        fields = '__all__'

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'

class MatriculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matricula
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = '__all__'

class CalificacionFinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionFinal
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class ComprobantePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobantePago
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    # Si quieres permitir escritura de grupos, ajusta según tu necesidad

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'groups']
