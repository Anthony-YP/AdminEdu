from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from gestion_academica.models.academia.Academia import Academia
from gestion_academica.models.persona.Persona import Director
from gestion_academica.serializers.AcademiaSerializer import AcademiaSerializer


class InstitucionPublicaView(APIView):
    """
    Información pública de la institución para el Home (invitados/aspirantes
    sin sesión): nombre, teléfono, dirección y el director a cargo. No
    expone datos sensibles de personas (cédula, correo, teléfono personal).
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):

        academia = Academia.objects.select_related("direccion").first()
        director = Director.objects.first()

        return Response({
            "academia": AcademiaSerializer(academia).data if academia else None,
            "director_nombre": (
                f"{director.nombres} {director.apellidos}"
                if director else None
            ),
        })
