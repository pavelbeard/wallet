import json

from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpRequest
from django.utils import timezone

from stuff.models import WalletUser
from stuff.utils import get_user_info, super_logger

logger = super_logger(__name__)


class HeaderSubstituteMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        if request.COOKIES.get("__clientid"):
            token = f"Bearer {request.COOKIES.get(settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'])}"
            request.META["HTTP_AUTHORIZATION"] = token

        if request.COOKIES.get("csrfmiddlewaretoken"):
            request.META["HTTP_X_CSRFTOKEN"] = request.COOKIES.get(
                "csrfmiddlewaretoken"
            )

        return self.get_response(request)


class UserInfoMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: WSGIRequest):
        # TODO: add ouath2 check
        if (
            request.path.startswith("/api/auth/signin")
            and request.META.get("HTTP_TEST_AGENT") is None
        ):
            body = json.loads(request.body.decode("utf-8"))
            email = body.get("email")
            if not email:
                return self.get_response(request)

            user = WalletUser.objects.get(email=email)
            user.last_login = timezone.now()
            user.save()

            get_user_info(request=request, user=user)

        return self.get_response(request)
