from allauth.account.adapter import DefaultAccountAdapter


class AdminEduAccountAdapter(DefaultAccountAdapter):
    """
    Adapter principal de cuentas para AdminEdu.

    Se utiliza para impedir el registro automático de usuarios
    mediante proveedores externos como Google.
    """

    def is_open_for_signup(self, request):
        """
        Solo los usuarios previamente registrados
        podrán iniciar sesión con Google.
        """
        return False