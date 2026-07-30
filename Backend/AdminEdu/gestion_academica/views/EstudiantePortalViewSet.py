from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from django.db import transaction
from django.utils import timezone
from django.utils.dateparse import parse_date

from gestion_academica.models.academia.Academia import Paralelo
from gestion_academica.models.persona.Persona import Persona, Estudiante
from gestion_academica.models.core.Core import Direccion
from gestion_academica.models.pagos.Pagos import ComprobantePago

from gestion_academica.services.MatriculaService import MatriculaService
from gestion_academica.services.PersonaService import PersonaService
from gestion_academica.services.RepresentanteService import RepresentanteService
from gestion_academica.serializers.DireccionSerializer import DireccionSerializer
from usuarios.permissions import EsEstudiante
from django.core.exceptions import ValidationError as DjangoValidationError


class EstudianteHistorialView(APIView):
    """
    RF09: Historial académico del estudiante autenticado — cursos en
    los que está matriculado (con horario y % de asistencia) y cursos
    ya completados (con su nota final).
    """

    permission_classes = [EsEstudiante]

    def get(self, request):
        user = request.user

        try:
            persona = Persona.objects.get(usuario=user)
            estudiante = Estudiante.objects.get(persona_ptr=persona)
        except (Persona.DoesNotExist, Estudiante.DoesNotExist):
            return Response([], status=status.HTTP_200_OK)

        matriculas = MatriculaService.listar_matriculas_estudiante(estudiante)

        resultado = []
        for m in matriculas:
            paralelo = m.paralelo_matricula
            curso = paralelo.curso
            calificacion = getattr(m, "calificacion_final", None)

            resultado.append({
                "id": m.id,
                "curso": curso.id,
                "curso_nombre": curso.nombre,
                "paralelo": paralelo.nombre,
                "paralelo_id": paralelo.id,
                "dias_clase": paralelo.dias_clase,
                "hora_inicio": paralelo.hora_inicio.isoformat() if paralelo.hora_inicio else None,
                "hora_fin": paralelo.hora_fin.isoformat() if paralelo.hora_fin else None,
                "estado": m.estado,
                "fecha_solicitud": m.fecha_solicitud.isoformat() if m.fecha_solicitud else None,
                "fecha_aprobacion": m.fecha_aprobacion.isoformat() if m.fecha_aprobacion else None,
                "porcentaje_asistencia": MatriculaService.calcular_porcentaje_asistencia(m),
                "nota_final": str(calificacion.nota_final) if calificacion else None,
                "aprobado": calificacion.aprobado if calificacion else None,
            })

        return Response(resultado, status=status.HTTP_200_OK)


class PerfilCompletadoView(APIView):
    """
    RF04: tras registrarse/iniciar sesión con Google, el estudiante
    completa su perfil con datos personales reales (no fabricados)
    antes de poder solicitar una matrícula. Si es menor de edad,
    también debe registrar a su representante legal (RF11).
    """

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        grupos = list(user.groups.values_list("name", flat=True))

        if "Estudiante" not in grupos:
            return Response(
                {"detail": "No tienes permiso para completar este perfil."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if Persona.objects.filter(usuario=user).exists():
            return Response(
                {"detail": "Ya completaste tu perfil anteriormente."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        datos = request.data

        direccion_serializer = DireccionSerializer(data=datos.get("direccion") or {})
        direccion_serializer.is_valid(raise_exception=True)

        fecha_nacimiento = parse_date(str(datos.get("fecha_nacimiento") or ""))

        if fecha_nacimiento is None:
            return Response(
                {"detail": "La fecha de nacimiento es obligatoria y debe tener formato AAAA-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        datos_representante = datos.get("representante_legal")

        if PersonaService.es_menor_edad(fecha_nacimiento) and not datos_representante:
            return Response(
                {"detail": "Por ser menor de edad, debe registrar los datos de un representante legal."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            direccion = Direccion.objects.create(**direccion_serializer.validated_data)

            datos_persona = dict(
                usuario=user,
                direccion=direccion,
                tipo_documento=datos.get("tipo_documento", "CEDULA"),
                numero_identificacion=datos.get("numero_identificacion"),
                nombres=datos.get("nombres"),
                apellidos=datos.get("apellidos"),
                correo=datos.get("correo") or user.email,
                telefono=datos.get("telefono"),
                fecha_nacimiento=fecha_nacimiento,
            )

            representante_legal = None

            if datos_representante:
                fecha_nacimiento_rep = parse_date(str(datos_representante.get("fecha_nacimiento") or ""))

                if fecha_nacimiento_rep is None:
                    raise DjangoValidationError(
                        "La fecha de nacimiento del representante legal "
                        "es obligatoria y debe tener formato AAAA-MM-DD."
                    )

                representante_legal = RepresentanteService.crear_representante(
                    direccion=direccion,
                    tipo_documento=datos_representante.get("tipo_documento", "CEDULA"),
                    numero_identificacion=datos_representante.get("numero_identificacion"),
                    nombres=datos_representante.get("nombres"),
                    apellidos=datos_representante.get("apellidos"),
                    correo=datos_representante.get("correo"),
                    telefono=datos_representante.get("telefono"),
                    fecha_nacimiento=fecha_nacimiento_rep,
                )

            estudiante = Estudiante(
                representante_legal=representante_legal,
                **datos_persona,
            )
            estudiante.save()

        except DjangoValidationError as e:
            return Response(
                {"detail": " ".join(e.messages) if hasattr(e, "messages") else str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "Perfil completado correctamente.", "estudiante_id": estudiante.pk},
            status=status.HTTP_201_CREATED,
        )


class SolicitarMatriculaView(APIView):
    """Permite a un estudiante solicitar matrícula con comprobante de pago."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @transaction.atomic
    def post(self, request):
        user = request.user
        grupos = list(user.groups.values_list("name", flat=True))

        if "Estudiante" not in grupos:
            return Response(
                {"detail": "No tienes permiso para solicitar una matrícula."},
                status=status.HTTP_403_FORBIDDEN,
            )

        paralelo_id = request.data.get("paralelo_id")
        comprobante = request.data.get("comprobante")
        tipo_pago = request.data.get("tipo_pago", "TRANSFERENCIA")
        monto = request.data.get("monto", "0.00")
        numero_ref = request.data.get("numero_ref", "")
        comentario = request.data.get("comentario", "")

        if not paralelo_id:
            return Response(
                {"detail": "Debe seleccionar un paralelo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if tipo_pago != "EFECTIVO":
            if not comprobante:
                return Response(
                    {"detail": "Debe adjuntar el comprobante de pago."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            nombre_archivo = getattr(comprobante, "name", "") or ""
            if not nombre_archivo.lower().endswith((".pdf", ".png")):
                return Response(
                    {"detail": "El comprobante debe ser un archivo PDF o PNG."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            tamano_maximo = 5 * 1024 * 1024  # 5 MB
            if getattr(comprobante, "size", 0) > tamano_maximo:
                return Response(
                    {"detail": "El comprobante no puede superar los 5 MB."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            comprobante = None

        try:
            paralelo = Paralelo.objects.get(id=paralelo_id)
        except Paralelo.DoesNotExist:
            return Response(
                {"detail": "El paralelo seleccionado no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            persona = Persona.objects.get(usuario=user)
            estudiante = Estudiante.objects.get(persona_ptr=persona)
        except Persona.DoesNotExist:
            return Response(
                {"detail": "Debe completar su perfil antes de solicitar una matrícula.",
                 "codigo": "PERFIL_INCOMPLETO"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Estudiante.DoesNotExist:
            persona = Persona.objects.get(usuario=user)
            estudiante = Estudiante(
                usuario=user,
                direccion=persona.direccion,
                tipo_documento=persona.tipo_documento,
                numero_identificacion=persona.numero_identificacion,
                nombres=persona.nombres,
                apellidos=persona.apellidos,
                correo=persona.correo,
                telefono=persona.telefono,
                fecha_nacimiento=persona.fecha_nacimiento,
            )
            estudiante.pk = persona.pk
            estudiante.save()

        comprobante_pago = ComprobantePago.objects.create(
            tipo_pago=tipo_pago,
            tipo_archivo=comprobante,
            monto=monto,
            fecha=timezone.now().date(),
            numero_ref=numero_ref if numero_ref else None,
        )

        try:
            matricula = MatriculaService.solicitar_matricula(
                estudiante=estudiante,
                paralelo=paralelo,
                comprobante_pago=comprobante_pago,
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if comentario:
            matricula.comentario = comentario
            matricula.save(update_fields=["comentario"])

        return Response({
            "id": matricula.id,
            "estado": matricula.estado,
            "fecha_solicitud": matricula.fecha_solicitud.isoformat(),
            "curso_nombre": paralelo.curso.nombre,
            "paralelo_nombre": paralelo.nombre,
        }, status=status.HTTP_201_CREATED)
