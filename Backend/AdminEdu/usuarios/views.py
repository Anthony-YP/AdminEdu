from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from .serializers import LoginSerializer, UserSerializer, GroupSerializer

User = get_user_model()  # Modelo de usuario activo (usuarios.Usuario)


# Vista de login (sin autenticación)
class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = serializer.validated_data["usuario"]

        refresh = RefreshToken.for_user(usuario)

        grupos = list(usuario.groups.values_list("name", flat=True))
        permisos = list(usuario.get_all_permissions())

        # Agregar datos al token
        refresh["grupos"] = grupos
        refresh["user_id"] = usuario.id
        refresh["username"] = usuario.username

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "usuario": {
                "id": usuario.id,
                "username": usuario.username,
                "email": usuario.email,
                "grupos": grupos,
                "rol_principal": grupos[0] if grupos else None,
                "permisos": permisos,
                "is_staff": usuario.is_staff,
                "is_superuser": usuario.is_superuser,
            }
        }, status=status.HTTP_200_OK)


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