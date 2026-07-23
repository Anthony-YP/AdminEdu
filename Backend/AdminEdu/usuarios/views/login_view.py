from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from usuarios.serializers import LoginSerializer


class LoginView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        print("========== LOGIN EJECUTADO ==========")

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        usuario = serializer.validated_data["usuario"]

        refresh = RefreshToken.for_user(usuario)

        return Response({

            "access": str(refresh.access_token),

            "refresh": str(refresh),

            "usuario": {

                "id": usuario.id,
                "username": usuario.username,
                "email": usuario.email,
                "first_name": usuario.first_name,
                "last_name": usuario.last_name,
                "groups": list(
                    usuario.groups.values_list(
                        "name",
                        flat=True
                    )
                )

            }

        }, status=status.HTTP_200_OK)