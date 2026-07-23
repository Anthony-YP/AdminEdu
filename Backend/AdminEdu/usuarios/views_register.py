from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Endpoint público para registrar un nuevo usuario.
    Solo crea el usuario básico; los grupos/roles se asignan
    posteriormente por un administrador.
    """
    username = request.data.get("username", "").strip()
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")

    # Validaciones
    if not username:
        return Response(
            {"detail": "El nombre de usuario es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not email:
        return Response(
            {"detail": "El correo electrónico es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not password or len(password) < 6:
        return Response(
            {"detail": "La contraseña debe tener al menos 6 caracteres."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"detail": "El nombre de usuario ya está en uso."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"detail": "El correo electrónico ya está registrado."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        usuario = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=True
        )
        serializer = UserSerializer(usuario)
        return Response(
            {
                "mensaje": "Usuario registrado exitosamente.",
                "usuario": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        return Response(
            {"detail": f"Error al registrar: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )