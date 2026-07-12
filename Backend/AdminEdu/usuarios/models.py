from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):

    class Meta:
        db_table = "usuario"


    def __str__(self):
        return self.username
