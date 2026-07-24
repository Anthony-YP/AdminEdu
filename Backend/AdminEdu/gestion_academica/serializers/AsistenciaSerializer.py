from rest_framework import serializers

from gestion_academica.models.matricula.Matricula import Asistencia


class AsistenciaSerializer(serializers.ModelSerializer):

    estudiante_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Asistencia
        fields = ["id", "matricula", "estudiante_nombre", "fecha", "presente"]

    def get_estudiante_nombre(self, obj):
        estudiante = obj.matricula.estudiante
        return f"{estudiante.nombres} {estudiante.apellidos}"


class AsistenciaRegistroSerializer(serializers.Serializer):
    """Un registro individual dentro de un pase de lista masivo."""

    matricula_id = serializers.IntegerField()
    presente = serializers.BooleanField()


class AsistenciaBulkCreateSerializer(serializers.Serializer):
    """
    Registro masivo de asistencia para todos los estudiantes de un
    paralelo, en una fecha determinada (pase de lista).
    """

    paralelo_id = serializers.IntegerField()
    fecha = serializers.DateField()
    registros = AsistenciaRegistroSerializer(many=True)

    def validate_registros(self, value):
        if not value:
            raise serializers.ValidationError(
                "Debe incluir al menos un registro de asistencia."
            )
        return value
