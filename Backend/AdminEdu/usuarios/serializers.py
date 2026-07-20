from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()  # Usa el modelo de usuario personalizado (usuarios.Usuario)

# Serializer para login
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        usuario = authenticate(username=username, password=password)

        if usuario is None:
            raise serializers.ValidationError("Usuario o contraseña incorrectos")

        if not usuario.is_active:
            raise serializers.ValidationError("Usuario desactivado")

        data["usuario"] = usuario
        return data


# Serializer para grupos
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


# Serializer para usuarios (con grupos anidados)
class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'groups']