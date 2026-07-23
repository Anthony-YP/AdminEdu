from django.http import HttpResponseRedirect


class GoogleAuthView:

    @staticmethod
    def login(request):

        return HttpResponseRedirect(
            "/accounts/google/login/?process=login"
        )