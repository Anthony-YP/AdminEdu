from django.db import transaction
from django.core.exceptions import ValidationError


from gestion_academica.models.academia.Academia import Paralelo



class ParaleloService:
    """
    Contiene las reglas de negocio
    para Paralelos.
    """



    @staticmethod
    def listar_paralelos():

        return Paralelo.objects.select_related(
            "curso"
        ).all()



    @staticmethod
    def obtener_paralelo(paralelo_id):

        try:

            return Paralelo.objects.select_related(
                "curso"
            ).get(
                id=paralelo_id
            )


        except Paralelo.DoesNotExist:

            raise ValidationError(
                "El paralelo no existe"
            )



    @staticmethod
    @transaction.atomic
    def crear_paralelo(data):


        curso = data.get(
            "curso"
        )

        nombre = data.get(
            "nombre"
        )

        capacidad = data.get(
            "capacidad"
        )



        ParaleloService.validar_datos(
            nombre,
            capacidad
        )


        existe = Paralelo.objects.filter(
            curso=curso,
            nombre__iexact=nombre
        ).exists()



        if existe:

            raise ValidationError(
                "Ya existe este paralelo en el curso"
            )



        paralelo = Paralelo.objects.create(
            curso=curso,
            nombre=nombre,
            capacidad=capacidad
        )


        return paralelo




    @staticmethod
    @transaction.atomic
    def actualizar_paralelo(paralelo,data):


        nombre = data.get(
            "nombre",
            paralelo.nombre
        )


        capacidad = data.get(
            "capacidad",
            paralelo.capacidad
        )



        ParaleloService.validar_datos(
            nombre,
            capacidad
        )



        if Paralelo.objects.filter(
            curso=paralelo.curso,
            nombre__iexact=nombre
        ).exclude(
            id=paralelo.id
        ).exists():


            raise ValidationError(
                "Ya existe otro paralelo con ese nombre"
            )



        paralelo.nombre = nombre

        paralelo.capacidad = capacidad


        paralelo.save()



        return paralelo




    @staticmethod
    @transaction.atomic
    def eliminar_paralelo(paralelo):


        paralelo.delete()




    @staticmethod
    def validar_datos(nombre,capacidad):


        if not nombre:

            raise ValidationError(
                "El nombre del paralelo es obligatorio"
            )


        if capacidad <= 0:

            raise ValidationError(
                "La capacidad debe ser mayor a cero"
            )