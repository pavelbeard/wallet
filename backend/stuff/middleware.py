import json
import logging
import os

import requests
from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpRequest
from django.utils import timezone
from user_agents import parse

from stuff.models import DDevice, WalletUser, WalletUserDevice
from stuff.utils import regex_get

logger = logging.getLogger(__name__)


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
        if request.path.startswith("/api/auth/signin"):
            body = json.loads(request.body.decode("utf-8"))
            email = body.get("email")
            if not email:
                return self.get_response(request)

            user = WalletUser.objects.get(email=email)
            user.last_login = timezone.now()
            user.save()

            location_request = requests.get(
                f"https://geolocation-db.com/json/{os.environ.get('GEO_API_KEY')}"
            )

            location = ""
            if location_request.status_code == 200:
                location_data = location_request.json()
                location = (
                    f"{location_data.get('city')}, {location_data.get('country_name')}"
                )

            try:
                ua = parse(request.META.get("HTTP_USER_AGENT"))
                browser = regex_get(
                    dict=request.META,
                    key="HTTP_SEC_CH_UA",
                    default=ua.browser.family,
                    pattern=r'([^"]+)',
                )
                platform = regex_get(
                    dict=request.META,
                    key="HTTP_SEC_CH_UA_PLATFORM",
                    default=ua.os.family,
                    pattern=r'([^"]+)',
                )
                version = regex_get(
                    dict=request.META,
                    key="HTTP_SEC_CH_UA_VERSION",
                    default=ua.os.version_string,
                    pattern=r"^(.*?)(\s.*)?$",
                )
                device = DDevice.objects.filter(d_name__contains=browser).first()

                wallet_user_device = WalletUserDevice.objects.filter(
                    wallet_user=user,
                    d_device=device,
                ).first()
                
                if wallet_user_device is None:
                    wallet_user_device = {
                        "wallet_user": user,
                        "d_device": device,
                        "operational_system": f"{platform} {version}",
                        "d_ip_address": request.META.get("REMOTE_ADDR"),
                        "location": location,
                        "created_at": timezone.now(),
                        "last_access": user.last_login,
                    }
                    WalletUserDevice.objects.create(**wallet_user_device)
                else:
                    wallet_user_device.last_access = user.last_login
                    wallet_user_device.operational_system = f"{platform} {version}"
                    wallet_user_device.d_ip_address = request.META.get("REMOTE_ADDR")
                    wallet_user_device.location = location
                    wallet_user_device.save()
                    
            except Exception as e:
                logger.error(e, exc_info=True)

        return self.get_response(request)
