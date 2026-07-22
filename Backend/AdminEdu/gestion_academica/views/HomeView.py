from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from gestion_academica.models.academia.Academia import Academia, Curso
from gestion_academica.api.serializers import AcademiaSerializer, CursoSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def home_info(request):
    """Endpoint público que devuelve información de la academia para la página de inicio."""
    academias = Academia.objects.all()
    serializer = AcademiaSerializer(academias, many=True)
    return Response({
        "academias": serializer.data,
        "total_academias": academias.count(),
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def cursos_disponibles(request):
    """Endpoint público que devuelve los cursos disponibles."""
    cursos = Curso.objects.all().select_related("academia")
    serializer = CursoSerializer(cursos, many=True)
    return Response({
        "cursos": serializer.data,
        "total_cursos": cursos.count(),
    })
