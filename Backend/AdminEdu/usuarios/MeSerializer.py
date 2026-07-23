from rest_framework import serializers

from usuarios.models import Usuario


from allauth.socialaccount.models import SocialAccount


class MeSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField()

    class Meta:

        model = Usuario

        fields = [

            "id",

            "username",

            "email",

            "first_name",

            "last_name",

            "photo",

        ]

    def get_photo(self, obj):

        try:

            social = SocialAccount.objects.get(user=obj)

            return social.extra_data.get("picture")

        except SocialAccount.DoesNotExist:

            return None