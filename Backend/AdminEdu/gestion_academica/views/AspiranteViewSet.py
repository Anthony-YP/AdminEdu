from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from django.db import transaction
from django.utils import timezone

from gestion_academica.models.academia.Academia import Curso, Paralelo
from gestion_academica.models.persona.Persona import Persona, Estudiante
from gestion_academica.models.core.Core import Direccion
from gestion_academica.models.pagos.Pagos import ComprobantePago
from gestion_academica.models.matricula.Matricula import Matricula
from gestion_academica.models.matricula.estado_matricula import EstadoMatricula

from gestion_academica.services.CursoService import CursoService
from gestion_academica.services.MatriculaService import MatriculaService

from gestion_academica.api.serializers import CursoSerializer


class AspiranteCursosView(APIView):
    """Endpoint público: cursos disponibles para aspirantes."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cursos = CursoService.listar_cursos()
        serializer = CursoSerializer(cursos, many=True, context={"request": request})
        return Response(serializer.data)


class AspirantePerfilView(APIView):
    """Perfil del aspirante autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        grupos = list(user.groups.values_list("name", flat=True))

        if "Aspirante" not in grupos:
            return Response(
                {"detail": "No eres un aspirante."},
                status=status.HTTP_403_FORBIDDEN,
            )

        from allauth.socialaccount.models import SocialAccount
        photo = None
        try:
            social = SocialAccount.objects.get(user=user)
            photo = social.extra_data.get("picture")
        except SocialAccount.DoesNotExist:
            pass

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "grupos": grupos,
            "photo": photo,
        })


class AspiranteSolicitudesView(APIView):
    """Solicitudes de matrícula del aspirante."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        grupos = list(user.groups.values_list("name", flat=True))

        if "Aspirante" not in grupos:
            return Response(
                {"detail": "No eres un aspirante."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            persona = Persona.objects.get(usuario=user)
            estudiante = Estudiante.objects.get(persona_ptr=persona)
        except (Persona.DoesNotExist, Estudiante.DoesNotExist):
            return Response([], status=status.HTTP_200_OK)

        matriculas = Matricula.objects.filter(
            estudiante=estudiante
        ).select_related(
            "paralelo_matricula",
            "paralelo_matricula__curso",
            "comprobante_pago",
        ).order_by("-fecha_solicitud")

        resultado = []
        for m in matriculas:
            curso = m.paralelo_matricula.curso
            resultado.append({
                "id": m.id,
                "curso": curso.id,
                "curso_nombre": curso.nombre,
                "paralelo": m.paralelo_matricula.nombre,
                "paralelo_id": m.paralelo_matricula.id,
                "estado": m.estado,
                "fecha_solicitud": m.fecha_solicitud.isoformat() if m.fecha_solicitud else None,
                "fecha_aprobacion": m.fecha_aprobacion.isoformat() if m.fecha_aprobacion else None,
                "comentario": m.comentario or "",
                "comprobante_url": m.comprobante_pago.tipo_archivo.url if m.comprobante_pago and m.comprobante_pago.tipo_archivo else None,
            })

        return Response(resultado, status=status.HTTP_200_OK)


class AspiranteMatriculaView(APIView):
    """Permite a un aspirante solicitar matrícula con comprobante de pago."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @transaction.atomic
    def post(self, request):
        user = request.user
        grupos = list(user.groups.values_list("name", flat=True))

        if "Aspirante" not in grupos:
            return Response(
                {"detail": "No eres un aspirante."},
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

        if not comprobante:
            return Response(
                {"detail": "Debe adjuntar el comprobante de pago."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_types = ["application/pdf", "image/png"]
        if hasattr(comprobante, 'content_type') and comprobante.content_type not in allowed_types:
            return Response(
                {"detail": "El comprobante debe ser de tipo PDF o PNG."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
            estudiante = self._crear_estudiante_desde_google(user)
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

    def _obtener_o_crear_direccion(self):
        direccion, _ = Direccion.objects.get_or_create(
            ciudad="Por definir",
            defaults={
                "calle_principal": "Por definir",
                "calle_secundaria": "Por definir",
                "numero_casa": "S/N",
                "referencia": "Dirección pendiente de actualización",
            }
        )
        return direccion

    def _crear_estudiante_desde_google(self, user):
        from gestion_academica.services.PersonaService import PersonaService

        direccion = self._obtener_o_crear_direccion()

        num_id = f"{user.id:010d}"[-10:]
        telefono = f"09{user.id:08d}"[-10:]

        persona = Persona.objects.create(
            usuario=user,
            direccion=direccion,
            tipo_documento="CEDULA",
            numero_identificacion=num_id,
            nombres=user.first_name or "Sin Nombre",
            apellidos=user.last_name or "Sin Apellido",
            correo=user.email,
            telefono=telefono,
            fecha_nacimiento=timezone.now().date(),
        )

        estudiante = Estudiante(
            usuario=user,
            direccion=direccion,
            tipo_documento="CEDULA",
            numero_identificacion=num_id,
            nombres=persona.nombres,
            apellidos=persona.apellidos,
            correo=persona.correo,
            telefono=telefono,
            fecha_nacimiento=persona.fecha_nacimiento,
        )
        estudiante.pk = persona.pk
        estudiante.save()

        return estudiante
