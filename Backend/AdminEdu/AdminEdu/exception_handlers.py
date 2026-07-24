from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import ValidationError as DRFValidationError


def custom_exception_handler(exc, context):
    """
    RF35: asegura que cualquier `django.core.exceptions.ValidationError`
    levantado por los servicios de negocio (models.clean()/full_clean(),
    llamadas directas desde una vista) se traduzca a una respuesta 400
    estructurada, en vez de escaparse como un 500 sin manejar cuando el
    endpoint no la captura explícitamente con un try/except.
    """

    if isinstance(exc, DjangoValidationError):
        detalle = getattr(exc, "message_dict", None) or exc.messages
        exc = DRFValidationError(detail=detalle)

    return drf_exception_handler(exc, context)
