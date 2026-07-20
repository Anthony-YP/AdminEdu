from django.db import models


class EstadoMatricula(
    models.TextChoices
):

    PENDIENTE = (
        "Pendiente",
        "Pendiente"
    )

    APROBADA = (
        "Aprobada",
        "Aprobada"
    )

    RECHAZADA = (
        "Rechazada",
        "Rechazada"
    )

    CURSO_APROBADO = (
        "Curso Aprobado",
        "Curso Aprobado"
    )

    CURSO_REPROBADO = (
        "Curso Reprobado",
        "Curso Reprobado"
    )