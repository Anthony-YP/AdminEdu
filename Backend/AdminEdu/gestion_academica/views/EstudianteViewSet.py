from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_academica.models.persona.Persona import Estudiante
from gestion_academica.views.CoreViewSet import PermisosViewSet
from gestion_academica.services.EstudianteService import EstudianteService
from gestion_academica.serializers.EstudianteSerializer import (EstudianteSerializer,EstudianteCreateSerializer, )


class EstudianteViewSet(
    PermisosViewSet
):

    permission_create = permissions.IsAuthenticated

    permission_read = permissions.IsAuthenticated

    permission_update = permissions.IsAuthenticated

    permission_delete = permissions.IsAdminUser

    def get_queryset(self):

        return (
            EstudianteService.listar_estudiantes()
        )

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:

            return (
                EstudianteCreateSerializer
            )

        return EstudianteSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="me",
        permission_classes=[permissions.IsAuthenticated],
    )
    def me(self, request):
        estudiante = get_object_or_404(
            Estudiante,
            usuario=request.user,
        )

        serializer = EstudianteSerializer(estudiante)
        return Response(serializer.data)