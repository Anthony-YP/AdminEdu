from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import serializers, status

from usuarios.services.password_reset_service import PasswordResetService


MENSAJE_GENERICO = (
    "Si los datos ingresados son correctos, "
    "se enviaron las instrucciones de recuperación al correo asociado."
)


class PasswordResetRequestSerializer(serializers.Serializer):
    numero_identificacion = serializers.CharField()
    correo = serializers.EmailField()


class PasswordResetRequestView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        PasswordResetService.solicitar_reset(
            numero_identificacion=serializer.validated_data["numero_identificacion"],
            correo=serializer.validated_data["correo"],
        )

        return Response({"detail": MENSAJE_GENERICO}, status=status.HTTP_200_OK)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    nueva_password = serializers.CharField(write_only=True)


class PasswordResetConfirmView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            PasswordResetService.confirmar_reset(
                uidb64=serializer.validated_data["uid"],
                token=serializer.validated_data["token"],
                nueva_password=serializer.validated_data["nueva_password"],
            )
        except DjangoValidationError as e:
            return Response(
                {"detail": " ".join(e.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "Contraseña actualizada correctamente."},
            status=status.HTTP_200_OK,
        )
