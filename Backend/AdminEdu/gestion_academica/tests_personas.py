from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


User = get_user_model()


class PersonasAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_authenticate(self.user)

    def test_directores_endpoint_is_available(self):
        response = self.client.get("/api/directores/")
        self.assertEqual(response.status_code, 200)

    def test_secretarias_endpoint_is_available(self):
        response = self.client.get("/api/secretarias/")
        self.assertEqual(response.status_code, 200)

    def test_representantes_endpoint_is_available(self):
        response = self.client.get("/api/representantes/")
        self.assertEqual(response.status_code, 200)
