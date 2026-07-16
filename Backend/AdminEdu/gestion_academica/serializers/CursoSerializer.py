import serializers
from academia.Academia import Curso


class CursoCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Curso
        fields = [
            "academia",
            "nombre",
            "precio",
            "fecha_inicio",
            "fecha_fin",
        ]

    def validate_nombre(self, value):

        if not value or not value.strip():
            raise serializers.ValidationError(
                "El nombre del curso es obligatorio."
            )

        return value.strip()

    def validate_precio(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "El precio no puede ser menor a cero."
            )

        return value

    def validate(self, attrs):

        if attrs["fecha_inicio"] >= attrs["fecha_fin"]:
            raise serializers.ValidationError({
                "fecha_fin": (
                    "La fecha de finalización debe ser posterior "
                    "a la fecha de inicio."
                )
            })

        return attrs