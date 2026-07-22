from rest_framework import serializers

from gestion_academica.models.academia.Academia import Curso



class CursoSerializer(serializers.ModelSerializer):


    academia_nombre = serializers.CharField(
        source="academia.nombre",
        read_only=True
    )


    class Meta:

        model = Curso

        fields = [
            "id",
            "academia",
            "academia_nombre",
            "nombre",
            "precio",
            "fecha_inicio",
            "fecha_fin"
        ]



    def validate_nombre(self, value):

        if len(value.strip()) < 3:

            raise serializers.ValidationError(
                "El nombre del curso debe tener mínimo 3 caracteres"
            )


        return value



    def validate_precio(self,value):

        if value <= 0:

            raise serializers.ValidationError(
                "El precio debe ser mayor a cero"
            )

        return value



    def validate(self,data):

        fecha_inicio = data.get(
            "fecha_inicio"
        )

        fecha_fin = data.get(
            "fecha_fin"
        )


        if fecha_inicio and fecha_fin:

            if fecha_fin <= fecha_inicio:

                raise serializers.ValidationError(
                    "La fecha final debe ser mayor a la inicial"
                )


        return data