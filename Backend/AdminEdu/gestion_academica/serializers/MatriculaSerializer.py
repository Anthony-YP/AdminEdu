from rest_framework import serializers

from ..models.matricula.Matricula import Matricula
from ..services.MatriculaService import MatriculaService


class MatriculaSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Matricula

        fields = [
            "id",
            "estudiante",
            "paralelo_matricula",
            "comprobante_pago",
            "calificacion_final",
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


class MatriculaCreateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Matricula

        fields = [
            "paralelo_matricula",
            "comprobante_pago",
        ]

    def create(
        self,
        validated_data
    ):

        request = self.context.get(
            "request"
        )

        if request is None:

            raise serializers.ValidationError(
                "No se pudo obtener la solicitud actual."
            )

        usuario = request.user

        try:

            estudiante = (
                usuario.persona.estudiante
            )

        except AttributeError:

            raise serializers.ValidationError(
                "El usuario autenticado no tiene "
                "un estudiante asociado."
            )

        return (
            MatriculaService.solicitar_matricula(
                estudiante=estudiante,
                paralelo=validated_data[
                    "paralelo_matricula"
                ],
                comprobante_pago=validated_data[
                    "comprobante_pago"
                ]
            )
        )


class MatriculaRechazarSerializer(
    serializers.Serializer
):

    comentario = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True
    )


class MatriculaManualSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Matricula

        fields = [
            "estudiante",
            "paralelo_matricula",
            "comprobante_pago",
        ]

    def create(
        self,
        validated_data
    ):

        return (
            MatriculaService
            .crear_matricula_manual(
                estudiante=validated_data[
                    "estudiante"
                ],
                paralelo=validated_data[
                    "paralelo_matricula"
                ],
                comprobante_pago=validated_data[
                    "comprobante_pago"
                ]
            )
        )