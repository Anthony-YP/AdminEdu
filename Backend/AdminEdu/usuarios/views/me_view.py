from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from usuarios.serializers.me_serializer import MeSerializer, MeUpdateSerializer


class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = MeSerializer(
            request.user
        )

        data = serializer.data

        return Response(data)

    def patch(self, request):

        serializer = MeUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(MeSerializer(request.user).data)
