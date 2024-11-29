from django.conf import settings
from django.http import HttpRequest
from django.utils import timezone
from user_agents import parse

from stuff.stuff_logic import jwt_decode_handler
from stuff.models import DDevice, WalletUser, WalletUserDevice


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

    def __call__(self, request):
        if request.META.get("HTTP_AUTHORIZATION"):
            token = jwt_decode_handler(
                request.META.get("HTTP_AUTHORIZATION").split(" ")[1]
            )
            user = WalletUser.objects.get(public_id=token.get("public_id"))

            try:
                ua = parse(request.META.get("HTTP_USER_AGENT"))
                device = DDevice.objects.filter(
                    d_name__contains=ua.device.model
                ).first()
                WalletUserDevice.objects.create(
                    wallet_user=user,
                    d_device=device,
                    operational_system=f"{ua.os.family} {ua.os.version}",
                    d_ip_address=request.META.get("REMOTE_ADDR"),
                    location="",
                    created_at=timezone.now(),
                    last_access=timezone.now(),
                )
            except Exception:
                pass

            # print("wallet_user_device: ", wallet_user_device)

        return self.get_response(request)
