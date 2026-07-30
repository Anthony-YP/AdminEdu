from rest_framework import serializers

from ..models.matricula.Matricula import Matricula


class MatriculaSerializer(
    serializers.ModelSerializer
):

    estudiante_nombre = serializers.SerializerMethodField()
    estudiante_identificacion = serializers.CharField(
        source="estudiante.numero_identificacion", read_only=True
    )
    estudiante_correo = serializers.EmailField(
        source="estudiante.correo", read_only=True
    )
    estudiante_telefono = serializers.CharField(
        source="estudiante.telefono", read_only=True
    )
    curso_id = serializers.IntegerField(
        source="paralelo_matricula.curso.id", read_only=True
    )
    curso_nombre = serializers.CharField(
        source="paralelo_matricula.curso.nombre", read_only=True
    )
    curso_precio = serializers.DecimalField(
        source="paralelo_matricula.curso.precio",
        max_digits=8, decimal_places=2, read_only=True,
    )
    paralelo_nombre = serializers.CharField(
        source="paralelo_matricula.nombre", read_only=True
    )
    docente_nombre = serializers.SerializerMethodField()
    dias_clase = serializers.ListField(
        source="paralelo_matricula.dias_clase", read_only=True
    )
    hora_inicio = serializers.TimeField(
        source="paralelo_matricula.hora_inicio", read_only=True
    )
    hora_fin = serializers.TimeField(
        source="paralelo_matricula.hora_fin", read_only=True
    )
    cupo_max = serializers.IntegerField(
        source="paralelo_matricula.cupo_max", read_only=True
    )
    tipo_pago = serializers.CharField(
        source="comprobante_pago.tipo_pago", read_only=True
    )
    monto = serializers.DecimalField(
        source="comprobante_pago.monto",
        max_digits=8, decimal_places=2, read_only=True,
    )
    numero_ref = serializers.CharField(
        source="comprobante_pago.numero_ref", read_only=True
    )
    fecha_pago = serializers.DateField(
        source="comprobante_pago.fecha", read_only=True
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
            "estudiante_correo",
            "estudiante_telefono",
            "paralelo_matricula",
            "curso_id",
            "curso_nombre",
            "curso_precio",
            "paralelo_nombre",
            "docente_nombre",
            "dias_clase",
            "hora_inicio",
            "hora_fin",
            "cupo_max",
            "tipo_pago",
            "monto",
            "numero_ref",
            "fecha_pago",
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

    def get_docente_nombre(self, obj):
        docente = obj.paralelo_matricula.docente
        if not docente:
            return None
        return f"{docente.nombres} {docente.apellidos}"

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


