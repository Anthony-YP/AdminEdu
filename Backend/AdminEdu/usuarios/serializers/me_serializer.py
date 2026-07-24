from rest_framework import serializers

from usuarios.models import Usuario

from allauth.socialaccount.models import SocialAccount


class MeSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()

    class Meta:

        model = Usuario

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "photo",
            "groups",
        ]

    def get_photo(self, obj):
        try:
            social = SocialAccount.objects.get(user=obj)
            return social.extra_data.get("picture")
        except SocialAccount.DoesNotExist:
            return None

    def get_groups(self, obj):
        return list(
            obj.groups.values_list("name", flat=True)
        )


class MeUpdateSerializer(serializers.ModelSerializer):
    """
    RF03: edición del propio perfil. Solo expone campos de cuenta
    seguros para que el usuario los edite — nunca is_active, groups
    ni is_superuser, que son de exclusiva gestión administrativa.
    """

    class Meta:
        model = Usuario
        fields = ["first_name", "last_name", "email"]
