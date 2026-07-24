from datetime import date, timedelta
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.services.BaseService import  BaseService

class DocenteService(PersonaService, BaseService):

    @staticmethod
    def registrar_docente(docente):

        PersonaService.validar_persona(docente)
        DocenteService.validar_titulo(docente.titulo)
        DocenteService.validar_especialidad(docente.especialidad)

        return True

    @staticmethod
    def actualizar_docente(docente):

        PersonaService.validar_persona(docente)
        DocenteService.validar_titulo(docente.titulo)
        DocenteService.validar_especialidad(docente.especialidad)

        return True

    @staticmethod
    def validar_titulo(titulo):

        if not titulo or not titulo.strip():
            raise ValidationError(
                "El título del docente es obligatorio."
            )

        if len(titulo.strip()) < 3:
            raise ValidationError(
                "El título es demasiado corto."
            )
        if len(titulo.strip()) > 100:
            raise ValidationError(
                "El título no puede superar los 100 caracteres."
            )

        return True

    @staticmethod
    def validar_especialidad(especialidad):

        if not especialidad or not especialidad.strip():
            raise ValidationError(
                "La especialidad es obligatoria."
            )

        if len(especialidad.strip()) < 3:
            raise ValidationError(
                "La especialidad es demasiado corta."
            )
        if len(especialidad.strip()) > 100:
            raise ValidationError(
                "La especialidad no puede superar los 100 caracteres."
            )

        return True

    @staticmethod
    def visualizar_cursos(docente):

        return docente.paralelos.all()

    @staticmethod
    def validar_matricula_del_docente(matricula, docente):
        """
        RF24: un docente solo puede registrar/modificar asistencia
        de estudiantes matriculados en paralelos a su cargo.
        """

        if matricula.paralelo_matricula.docente_id != docente.pk:
            raise ValidationError(
                "El docente no puede registrar asistencia "
                "de una matrícula que no pertenece a sus paralelos."
            )

    @staticmethod
    @transaction.atomic
    def registrar_asistencia(matricula, docente, fecha, presente):
        """
        RF24: registra (o actualiza si ya existe para esa fecha)
        la asistencia de un estudiante matriculado.
        """

        from gestion_academica.models.matricula.Matricula import Asistencia

        DocenteService.validar_matricula_del_docente(matricula, docente)

        asistencia, _creada = Asistencia.objects.update_or_create(
            matricula=matricula,
            fecha=fecha,
            defaults={"presente": presente},
        )

        return asistencia

    @staticmethod
    @transaction.atomic
    def registrar_asistencia_bulk(paralelo, docente, fecha, registros):
        """
        RF24: registra la asistencia de todos los estudiantes de un
        paralelo (a cargo del docente) para una fecha determinada.

        `registros` es una lista de {"matricula_id": int, "presente": bool}.
        """

        from gestion_academica.models.matricula.Matricula import Matricula

        if paralelo.docente_id != docente.pk:
            raise ValidationError(
                "El docente no puede registrar asistencia "
                "de un paralelo que no está a su cargo."
            )

        asistencias = []
        for registro in registros:
            matricula = Matricula.objects.get(
                id=registro["matricula_id"],
                paralelo_matricula=paralelo,
            )
            asistencias.append(
                DocenteService.registrar_asistencia(
                    matricula=matricula,
                    docente=docente,
                    fecha=fecha,
                    presente=bool(registro.get("presente")),
                )
            )

        return asistencias

    @staticmethod
    def modificar_asistencia(asistencia, docente, presente):

        DocenteService.validar_matricula_del_docente(
            asistencia.matricula, docente
        )

        hoy = timezone.now().date()

        if (hoy - asistencia.fecha) > timedelta(days=3):
            raise ValidationError(
                "Solo puede modificar la asistencia dentro de los primeros 3 días."
            )

        asistencia.presente = presente
        asistencia.save(update_fields=["presente"])

        return asistencia