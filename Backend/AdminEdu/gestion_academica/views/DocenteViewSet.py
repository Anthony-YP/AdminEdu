from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.serializers.DocenteSerializer import DocenteSerializer
from usuarios.permissions import EsAdministrativo


class DocenteViewSet(PermisosViewSet):
    serializer_class = DocenteSerializer

    permission_create = EsAdministrativo
    permission_read = permissions.IsAuthenticated
    permission_update = EsAdministrativo
    permission_delete = EsAdministrativo

    def get_queryset(self):
        return self.get_serializer().Meta.model.objects.all().order_by("nombres", "apellidos")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
