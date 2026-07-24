from rest_framework import serializers

from ..models.matricula.Matricula import Matricula


class MatriculaSerializer(
    serializers.ModelSerializer
):

    estudiante_nombre = serializers.SerializerMethodField()
    estudiante_identificacion = serializers.CharField(
        source="estudiante.numero_identificacion", read_only=True
    )
    curso_nombre = serializers.CharField(
        source="paralelo_matricula.curso.nombre", read_only=True
    )
    paralelo_nombre = serializers.CharField(
        source="paralelo_matricula.nombre", read_only=True
    )
    comprobante_url = serializers.SerializerMethodField()
    nota_final = serializers.DecimalField(
        source="calificacion_final.nota_final",
        max_digits=4, decimal_places=2,
        read_only=True, default=None,
    )

    class Meta:

        model = Matricula

        fields = [
            "id",
            "estudiante",
            "estudiante_nombre",
            "estudiante_identificacion",
            "paralelo_matricula",
            "curso_nombre",
            "paralelo_nombre",
            "comprobante_pago",
            "comprobante_url",
            "calificacion_final",
            "nota_final",
            "fecha_solicitud",
            "fecha_aprobacion",
            "estado",
            "comentario",
        ]

        read_only_fields = [
            "id",
            "fecha_solicitud",
            "fecha_aprobacion",
            "estado",
            "calificacion_final",
            "comentario",
        ]

    def get_estudiante_nombre(self, obj):
        return f"{obj.estudiante.nombres} {obj.estudiante.apellidos}"

    def get_comprobante_url(self, obj):
        if not obj.comprobante_pago or not obj.comprobante_pago.tipo_archivo:
            return None
        request = self.context.get("request")
        url = obj.comprobante_pago.tipo_archivo.url
        return request.build_absolute_uri(url) if request else url


class MatriculaRechazarSerializer(
    serializers.Serializer
):

    comentario = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True
    )


class MatriculaCancelarSerializer(
    serializers.Serializer
):

    comentario = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True
    )


