from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.contrib.auth.models import Group

from usuarios.serializers.group_serializer import GroupSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Group.objects.all(),
        required=False,
    )

    groups_detail = GroupSerializer(
        source="groups",
        many=True,
        read_only=True,
    )

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
    )

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "groups",
            "groups_detail",
            "password",
        ]

    def create(self, validated_data):

        password = validated_data.pop("password", None)
        groups = validated_data.pop("groups", [])

        usuario = User(**validated_data)

        if password:
            usuario.set_password(password)
        else:
            usuario.set_unusable_password()

        usuario.save()

        if groups:
            usuario.groups.set(groups)

        return usuario

    def update(self, instance, validated_data):

        password = validated_data.pop("password", None)

        usuario = super().update(instance, validated_data)

        if password:
            usuario.set_password(password)
            usuario.save(update_fields=["password"])

        return usuario


class MeSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
        ]
