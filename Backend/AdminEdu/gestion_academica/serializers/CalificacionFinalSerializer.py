from rest_framework import serializers

from gestion_academica.models.matricula.Matricula import CalificacionFinal


class CalificacionFinalSerializer(serializers.ModelSerializer):

    class Meta:
        model = CalificacionFinal
        fields = ["id", "nota_final", "aprobado", "fecha_registro"]
        read_only_fields = ["id", "aprobado", "fecha_registro"]


class CalificacionFinalRegistrarSerializer(serializers.Serializer):

    matricula_id = serializers.IntegerField()
    nota_final = serializers.DecimalField(max_digits=4, decimal_places=2)


class CalificacionFinalActualizarSerializer(serializers.Serializer):

    nota_final = serializers.DecimalField(max_digits=4, decimal_places=2)
