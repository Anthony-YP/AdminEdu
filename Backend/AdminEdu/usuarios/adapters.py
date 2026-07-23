from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class AdminEduAccountAdapter(DefaultAccountAdapter):

    def is_open_for_signup(self, request):
        return True

    def get_login_redirect_url(self, request):
        return "/api/auth/google/callback-process/"