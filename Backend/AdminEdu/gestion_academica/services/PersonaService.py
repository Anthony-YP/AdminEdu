from datetime import date

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from gestion_academica.models.persona.Tipo_documento import Tipo_documento
from gestion_academica.models.persona.Persona import Persona

class PersonaService:

    @staticmethod
    def validar_nombres(nombres: str):

        if not nombres or not nombres.strip():
            raise ValidationError("Los nombres son obligatorios.")

        nombres = nombres.strip()

        if len(nombres) < 3:
            raise ValidationError("Los nombres deben tener al menos 3 caracteres.")

        if len(nombres) > 100:
            raise ValidationError("Los nombres no pueden superar los 100 caracteres.")

        if not nombres.replace(" ", "").isalpha():
            raise ValidationError("Los nombres solo pueden contener letras.")

        return True

    @staticmethod
    def validar_apellidos(apellidos: str):

        if not apellidos or not apellidos.strip():
            raise ValidationError("Los apellidos son obligatorios.")

        apellidos = apellidos.strip()

        if len(apellidos) < 3:
            raise ValidationError("Los apellidos deben tener al menos 3 caracteres.")

        if len(apellidos) > 100:
            raise ValidationError("Los apellidos no pueden superar los 100 caracteres.")

        if not apellidos.replace(" ", "").isalpha():
            raise ValidationError("Los apellidos solo pueden contener letras.")

        return True

    @staticmethod
    def validar_correo(correo: str):

        if not correo or not correo.strip():
            raise ValidationError("El correo electrónico es obligatorio.")

        try:
            validate_email(correo)
        except ValidationError:
            raise ValidationError("El correo electrónico no tiene un formato válido.")

        return True

    @staticmethod
    def validar_telefono(telefono: str):

        if not telefono:
            raise ValidationError("El teléfono es obligatorio.")

        if not telefono.isdigit():
            raise ValidationError("El teléfono solo puede contener números.")

        if len(telefono) != 10:
            raise ValidationError("El teléfono debe contener exactamente 10 dígitos.")

        return True

    @staticmethod
    def validar_tipo_documento(tipo_documento):

        if tipo_documento not in Tipo_documento.values:
            raise ValidationError("El tipo de documento no es válido.")

        return True

    @staticmethod
    def validar_identificacion(tipo_documento, identificacion):

        PersonaService.validar_tipo_documento(tipo_documento)

        if not identificacion:
            raise ValidationError("El número de identificación es obligatorio.")

        identificacion = identificacion.strip()

        if tipo_documento == Tipo_documento.CEDULA:

            if not identificacion.isdigit():
                raise ValidationError("La cédula solo puede contener números.")

            if len(identificacion) != 10:
                raise ValidationError("La cédula debe contener exactamente 10 dígitos.")

            # Aquí posteriormente se puede implementar
            # el algoritmo oficial de validación de la cédula ecuatoriana.

        elif tipo_documento == Tipo_documento.PASAPORTE:

            if len(identificacion) != 9:
                raise ValidationError("El pasaporte debe contener exactamente 9 caracteres.")

            if not identificacion.isalnum():
                raise ValidationError("El pasaporte solo puede contener letras y números.")

        return True

    @staticmethod
    def validar_fecha_nacimiento(fecha_nacimiento):

        if fecha_nacimiento is None:
            raise ValidationError("La fecha de nacimiento es obligatoria.")

        if fecha_nacimiento > date.today():
            raise ValidationError("La fecha de nacimiento no puede ser una fecha futura.")

        return True

    @staticmethod
    def es_menor_edad(fecha_nacimiento):
        PersonaService.validar_fecha_nacimiento(fecha_nacimiento)

        hoy = date.today()

        edad = hoy.year - fecha_nacimiento.year - (
                (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day)
        )

        return edad

    @staticmethod
    def validar_persona(persona):

        PersonaService.validar_nombres(persona.nombres)
        PersonaService.validar_apellidos(persona.apellidos)
        PersonaService.validar_correo(persona.correo)
        PersonaService.validar_telefono(persona.telefono)

        PersonaService.validar_identificacion(
            persona.tipo_documento,
            persona.numero_identificacion
        )

        PersonaService.validar_fecha_nacimiento(
            persona.fecha_nacimiento
        )

        return True

    @staticmethod
    def crear_persona(**datos):

        persona = Persona(**datos)

        PersonaService.validar_persona(persona)

        persona.save()

        return persona

    @staticmethod
    def actualizar_persona(persona, **datos):

        for campo, valor in datos.items():
            setattr(persona, campo, valor)

        PersonaService.validar_persona(persona)

        persona.save()

        return persona

    @staticmethod
    def listar_personas():

        return Persona.objects.all()

    @staticmethod
    def eliminar_persona(persona):

        persona.delete()