from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import Group

from usuarios.serializers import GroupSerializer
from usuarios.permissions import EsDirector


class GroupViewSet(ModelViewSet):

    queryset = Group.objects.all()

    serializer_class = GroupSerializer

    permission_classes = [EsDirector]