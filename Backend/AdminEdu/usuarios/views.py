from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer


class LoginView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        usuario = serializer.validated_data["usuario"]

        refresh = RefreshToken.for_user(usuario)

        grupos = list(
            usuario.groups.values_list(
                "name",
                flat=True
            )
        )

        permisos = list(
            usuario.get_all_permissions()
        )

        refresh["grupos"] = grupos
        refresh["user_id"] = usuario.id
        refresh["username"] = usuario.username

        return Response({

            "refresh": str(refresh),

            "access": str(
                refresh.access_token
            ),

            "usuario": {

                "id": usuario.id,

                "username": usuario.username,

                "email": usuario.email,

                "grupos": grupos,

                "rol_principal": (
                    grupos[0]
                    if grupos
                    else None
                ),

                "permisos": permisos,

                "is_staff": usuario.is_staff,

                "is_superuser": usuario.is_superuser,

            }

        }, status=status.HTTP_200_OK)