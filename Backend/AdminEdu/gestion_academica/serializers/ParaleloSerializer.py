from rest_framework import serializers


from gestion_academica.models.academia.Academia import Paralelo



class ParaleloSerializer(
    serializers.ModelSerializer
):


    curso_nombre = serializers.CharField(
        source="curso.nombre",
        read_only=True
    )



    class Meta:


        model = Paralelo


        fields = [

            "id",

            "curso",

            "curso_nombre",

            "nombre",

            "capacidad",

            "activo"

        ]



    def validate_nombre(self,value):


        if len(value.strip()) < 1:


            raise serializers.ValidationError(
                "El nombre del paralelo es obligatorio"
            )


        return value




    def validate_capacidad(self,value):


        if value <= 0:


            raise serializers.ValidationError(
                "La capacidad debe ser mayor a cero"
            )


        return value