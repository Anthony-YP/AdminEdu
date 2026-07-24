from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usuarios.serializers import LoginSerializer
from usuarios.services.auth.jwt_service import JWTService
from usuarios.services.authentication_service import AuthenticationService


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

        tokens = JWTService.generate_tokens(usuario)

        return Response({
            "access": tokens["access"],
            "refresh": tokens["refresh"],
            "usuario": AuthenticationService.build_user_response(usuario),
        }, status=status.HTTP_200_OK)