from rest_framework.permissions import BasePermission, SAFE_METHODS

from usuarios.models import GRUPO_ADMINISTRADOR


def pertenece_a(user, grupos=None):
    """
    True si el usuario está autenticado y es superusuario, pertenece al
    grupo 'Administrador' (bypass equivalente a superusuario), o pertenece
    a alguno de los `grupos` indicados.

    Si `grupos` es None o vacío, cualquier usuario autenticado cumple
    (útil para permisos que solo exigen estar logueado más el bypass admin).
    """
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    if user.groups.filter(name=GRUPO_ADMINISTRADOR).exists():
        return True
    if not grupos:
        return True
    return user.groups.filter(name__in=grupos).exists()


class TieneGrupo(BasePermission):
    """
    Verifica que el usuario pertenezca a ALGUNO de los grupos especificados.
    Uso: TieneGrupo(['Director', 'Secretaria'])
    """

    def __init__(self, grupos_permitidos=None):
        self.grupos_permitidos = grupos_permitidos or []

    def has_permission(self, request, view):
        return pertenece_a(request.user, self.grupos_permitidos)


class EsDirector(BasePermission):
    """Director o Administrador"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Director'])


class EsSecretaria(BasePermission):
    """Secretaria o Administrador"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Secretaria'])


class EsDocente(BasePermission):
    """Docente o Administrador"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Docente'])


class EsEstudiante(BasePermission):
    """Estudiante o Administrador"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Estudiante'])


class EsRepresentante(BasePermission):
    """Representante o Administrador"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Representante'])


class EsAdministrativo(BasePermission):
    """Director, Secretaria o Administrador (personal administrativo)"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Director', 'Secretaria'])


class EsPersonalInstitucion(BasePermission):
    """Director, Secretaria, Docente o Administrador (personal de la institución)"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Director', 'Secretaria', 'Docente'])


class EsDirectorOSuperuser(BasePermission):
    """Solo Director o Administrador/superusuario"""
    def has_permission(self, request, view):
        return pertenece_a(request.user, ['Director'])


class PermisoPorAccion(BasePermission):
    """
    Permiso flexible que asigna grupos según la acción del ViewSet.
    Uso en ViewSet:
        permission_classes = [PermisoPorAccion]
        permiso_por_accion = {
            'list': [TieneGrupo(['Director', 'Secretaria'])],
            'create': [EsDirector()],
            ...
        }
    """
    def has_permission(self, request, view):
        if not pertenece_a(request.user):
            return False
        if request.user.is_superuser or request.user.groups.filter(name=GRUPO_ADMINISTRADOR).exists():
            return True

        # Obtener mapa de permisos por acción desde el ViewSet
        mapa = getattr(view, 'permiso_por_accion', {})
        permisos_requeridos = mapa.get(view.action, None)

        if permisos_requeridos is None:
            # Por defecto: cualquier autenticado
            return True

        # El usuario debe cumplir AL MENOS UNO de los permisos
        for permiso in permisos_requeridos:
            if permiso.has_permission(request, view):
                return True
        return False
