from rest_framework.permissions import BasePermission, SAFE_METHODS


class TieneGrupo(BasePermission):
    """
    Verifica que el usuario pertenezca a ALGUNO de los grupos especificados.
    Uso: TieneGrupo(['Director', 'Secretaria'])
    """

    def __init__(self, grupos_permitidos=None):
        self.grupos_permitidos = grupos_permitidos or []

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        if not self.grupos_permitidos:
            return True
        return request.user.groups.filter(
            name__in=self.grupos_permitidos
        ).exists()


class EsDirector(BasePermission):
    """Solo usuarios en el grupo 'Director'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or
            request.user.groups.filter(name='Director').exists()
        )


class EsSecretaria(BasePermission):
    """Solo usuarios en el grupo 'Secretaria'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or
            request.user.groups.filter(name='Secretaria').exists()
        )


class EsDocente(BasePermission):
    """Solo usuarios en el grupo 'Docente'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or
            request.user.groups.filter(name='Docente').exists()
        )


class EsEstudiante(BasePermission):
    """Solo usuarios en el grupo 'Estudiante'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or
            request.user.groups.filter(name='Estudiante').exists()
        )


class EsRepresentante(BasePermission):
    """Solo usuarios en el grupo 'Representante'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or
            request.user.groups.filter(name='Representante').exists()
        )


class EsAdministrativo(BasePermission):
    """Director o Secretaria (personal administrativo)"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(
            name__in=['Director', 'Secretaria']
        ).exists()


class EsPersonalInstitucion(BasePermission):
    """Director, Secretaria o Docente (personal de la institución)"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(
            name__in=['Director', 'Secretaria', 'Docente']
        ).exists()


class EsDirectorOSuperuser(BasePermission):
    """Solo Director o superusuario"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(name='Director').exists()


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
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
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