from rest_framework import serializers

from gestion_academica.models.academia.Academia import Curso


class ParaleloBasicoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    docente_nombre = serializers.SerializerMethodField()
    dias_clase = serializers.ListField(child=serializers.CharField())
    hora_inicio = serializers.TimeField()
    hora_fin = serializers.TimeField()
    cupo_max = serializers.IntegerField()
    estado = serializers.CharField()

    def get_docente_nombre(self, obj):
        if hasattr(obj, 'docente') and obj.docente:
            return f"{obj.docente.nombres} {obj.docente.apellidos}"
        return "Sin asignar"


class CursoCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Curso

        fields = [
            "academia",
            "nombre",
            "descripcion",
            "imagen",
            "precio",
            "fecha_inicio",
            "fecha_fin",
        ]

        extra_kwargs = {
            "nombre": {
                "required": True
            },
            "descripcion": {
                "required": True
            },
            "imagen": {
                "required": False
            },
            "precio": {
                "required": True
            },
            "fecha_inicio": {
                "required": True
            },
            "fecha_fin": {
                "required": True
            },
        }


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
            "estado",
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
