from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from usuarios.serializers import MeSerializer


class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = MeSerializer(
            request.user
        )

        data = serializer.data

        data["groups"] = list(
            request.user.groups.values_list(
                "name",
                flat=True
            )
        )

        return Response(data)