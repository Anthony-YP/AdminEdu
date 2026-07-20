from rest_framework.exceptions import APIException
from rest_framework import status


class BusinessException(APIException):
    """
    Excepción base para todas las reglas de negocio.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Se produjo en el servidor."
    default_code = "business_error"


class UsuarioInactivoException(BusinessException):
    default_detail = "El usuario se encuentra inactivo."


class CursoLlenoException(BusinessException):
    default_detail = "El curso alcanzó el cupo máximo permitido."


class MatriculaDuplicadaException(BusinessException):
    default_detail = "El estudiante ya posee una matrícula para este curso."


class RepresentanteRequeridoException(BusinessException):
    default_detail = "Los estudiantes menores de edad deben registrar un representante."


class ComprobanteInvalidoException(BusinessException):
    default_detail = "El comprobante debe estar en formato PDF o PNG."


class EstadoMatriculaException(BusinessException):
    default_detail = "La transición de estado de la matrícula no es válida."


class AsistenciaFueraDeTiempoException(BusinessException):
    default_detail = "La asistencia únicamente puede modificarse durante los tres días posteriores a su registro."


class CalificacionInvalidaException(BusinessException):
    default_detail = "La calificación debe encontrarse entre 0 y 10."


class PermisoDenegadoException(BusinessException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "No posee permisos para realizar esta operación."