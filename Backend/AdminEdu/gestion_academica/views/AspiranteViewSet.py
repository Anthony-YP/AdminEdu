from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.CursoService import CursoService
from gestion_academica.api.serializers import CursoSerializer


class AspiranteCursosView(APIView):
    """Endpoint público: cursos disponibles para aspirantes."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cursos = CursoService.listar_cursos()
        serializer = CursoSerializer(cursos, many=True, context={"request": request})
        return Response(serializer.data)


class AspirantePerfilView(APIView):
    """Perfil del aspirante autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        grupos = list(user.groups.values_list("name", flat=True))

        if "Aspirante" not in grupos:
            return Response(
                {"detail": "No eres un aspirante."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "grupos": grupos,
        })


class AspiranteSolicitudesView(APIView):
    """Solicitudes de matrícula del aspirante."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response([], status=status.HTTP_200_OK)
