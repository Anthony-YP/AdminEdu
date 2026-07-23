from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.contrib.auth.models import Group


User = get_user_model()



class UserSerializer(serializers.ModelSerializer):

    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True
    )


    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "groups",
        ]



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