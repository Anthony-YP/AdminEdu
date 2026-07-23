from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .serializers import MeSerializer

from .serializers import (
    LoginSerializer,
    UserSerializer,
    GroupSerializer,
    MeSerializer,
)

from .services.auth.jwt_service import JWTService
from .services.authentication_service import AuthenticationService


User = get_user_model()


class LoginView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        usuario = serializer.validated_data["usuario"]

        tokens = JWTService.generate_tokens(usuario)

        return Response(
            {
                "refresh": tokens["refresh"],
                "access": tokens["access"],
                "usuario": AuthenticationService.build_user_response(usuario),
            },
            status=status.HTTP_200_OK,
        )

# ViewSet para usuarios (solo autenticados)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# ViewSet para grupos (solo autenticados)
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]



class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = MeSerializer(request.user)

        return Response(serializer.data)
    
