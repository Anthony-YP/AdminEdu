from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from gestion_academica.models.core.Core import Direccion
from gestion_academica.models.persona.Persona import Docente, Persona
from gestion_academica.models.persona.Tipo_documento import Tipo_documento
from gestion_academica.models.notificaciones.Notificacion import Notificacion

User = get_user_model()


class DocentesAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_authenticate(self.user)

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
        response = self.client.get("/api/docentes/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.docente.id)
        self.assertEqual(response.data[0]["nombres"], "Ana")


class EstudianteDataAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="student", password="testpass123")
        self.client.force_authenticate(self.user)

        self.direccion = Direccion.objects.create(
            ciudad="Quito",
            calle_principal="Av. Central",
            calle_secundaria="10 de Agosto",
            numero_casa="123",
            referencia="Cerca del parque",
        )

        self.persona = Persona.objects.create(
            usuario=self.user,
            direccion=self.direccion,
            tipo_documento=Tipo_documento.CEDULA,
            numero_identificacion="1712345671",
            nombres="Carlos",
            apellidos="Mora",
            correo="carlos.mora@test.com",
            telefono="0999999991",
            fecha_nacimiento="1998-01-01",
        )

        self.otra_persona = Persona.objects.create(
            direccion=self.direccion,
            tipo_documento=Tipo_documento.CEDULA,
            numero_identificacion="1712345672",
            nombres="Ana",
            apellidos="Pérez",
            correo="ana.perez2@test.com",
            telefono="0999999992",
            fecha_nacimiento="1997-01-01",
        )

        self.notificacion_propia = Notificacion.objects.create(
            usuario=self.user,
            mensaje="Tu matrícula fue aprobada",
            fecha="2024-01-01T00:00:00Z",
        )
        self.notificacion_otra = Notificacion.objects.create(
            usuario=User.objects.create_user(username="other", password="testpass123"),
            mensaje="Otra notificación",
            fecha="2024-01-01T00:00:00Z",
        )

    def test_personas_devuelven_solo_la_persona_del_usuario_autenticado(self):
        response = self.client.get("/api/personas/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.persona.id)
        self.assertEqual(response.data[0]["nombres"], "Carlos")

    def test_notificaciones_devuelven_solo_las_del_usuario_autenticado(self):
        response = self.client.get("/api/notificaciones/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["mensaje"], "Tu matrícula fue aprobada")

    def test_estudiante_me_endpoint_devuelve_estudiante_autenticado(self):
        response = self.client.get("/api/estudiantes/me/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.persona.id)
        self.assertEqual(response.data["nombres"], "Carlos")
        self.assertEqual(response.data["correo"], "carlos.mora@test.com")
