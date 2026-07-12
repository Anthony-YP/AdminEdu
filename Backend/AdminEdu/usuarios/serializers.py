from rest_framework import serializers
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True
    )

    def validate(self, data):

        username = data.get("username")
        password = data.get("password")

        usuario = authenticate(
            username=username,
            password=password
        )

        if usuario is None:
            raise serializers.ValidationError(
                "Usuario o contraseña incorrectos"
            )

        if not usuario.is_active:
            raise serializers.ValidationError(
                "Usuario desactivado"
            )

        data["usuario"] = usuario

        return data