from django.contrib.auth.models import Group
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from gestion_academica.models.core.Core import Direccion
from gestion_academica.models.persona.Persona import Docente
from gestion_academica.models.persona.Tipo_documento import Tipo_documento

User = get_user_model()


class DocentesAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass123")

        self.direccion = Direccion.objects.create(
            ciudad="Quito",
            calle_principal="Av. Central",
            calle_secundaria="10 de Agosto",
            numero_casa="123",
            referencia="Cerca del parque",
        )

        self.docente = Docente.objects.create(
            direccion=self.direccion,
            tipo_documento=Tipo_documento.CEDULA,
            numero_identificacion="1712345678",
            nombres="Ana",
            apellidos="Pérez",
            correo="ana.perez@test.com",
            telefono="0999999999",
            fecha_nacimiento="1990-01-01",
            titulo="Licenciada",
            especialidad="Matemáticas",
        )

    def test_listar_docentes_disponibles(self):
        grupo, _ = Group.objects.get_or_create(name="Director")
        self.user.groups.add(grupo)
        self.client.force_authenticate(self.user)

        response = self.client.get("/api/docentes/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.docente.id)
        self.assertEqual(response.data[0]["nombres"], "Ana")

    def test_listar_docentes_sin_rol_institucional_es_rechazado(self):
        self.client.force_authenticate(self.user)

        response = self.client.get("/api/docentes/")

        self.assertEqual(response.status_code, 403)
