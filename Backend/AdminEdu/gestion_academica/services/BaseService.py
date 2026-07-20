from django.db import transaction
from django.utils import timezone


class BaseService:
    """
    Clase base para todos los servicios del sistema.
    """

    @staticmethod
    def now():
        return timezone.now()

    @staticmethod
    @transaction.atomic
    def atomic(func, *args, **kwargs):
        """
        Ejecuta una operación dentro de una transacción.
        """
        return func(*args, **kwargs)