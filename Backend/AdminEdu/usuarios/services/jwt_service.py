from rest_framework_simplejwt.tokens import RefreshToken


class JWTService:

    @staticmethod
    def generate_tokens(user):

        refresh = RefreshToken.for_user(user)

        grupos = list(
            user.groups.values_list(
                "name",
                flat=True
            )
        )

        refresh["grupos"] = grupos
        refresh["user_id"] = user.id
        refresh["username"] = user.username

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }