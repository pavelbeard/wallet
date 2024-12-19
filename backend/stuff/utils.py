import logging
import os
import random
import re
import string
from typing import Any, Dict, List

import requests
import resend
import resend.exceptions
from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpRequest
from django.utils import timezone
from user_agents import parse

from stuff.models import DDevice, WalletUser, WalletUserDevice


def super_logger(name: str) -> logging.Logger:
    _logger = logging.getLogger(name)
    _logger.setLevel(logging.DEBUG)

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    ch.setFormatter(formatter)
    _logger.addHandler(ch)

    return _logger


utils_logger = super_logger(__name__)


def regex_get(dict: Dict, key: Any, default: Any = None, pattern: str = None) -> Any:
    """Get a value from a dictionary by a key and a regex pattern"""
    if key in dict:
        if pattern is None:
            return dict[key]
        else:
            result = re.search(pattern, dict[key])
            if result:
                return result.group(1)
            else:
                return default
    else:
        return default


def suggest_username(username: str, count: int = 3) -> List[str]:
    """Suggest username"""
    suggestions = []

    for _ in range(count):
        number = random.randint(1, 9999)
        suffix = "".join(random.choices(string.ascii_lowercase, k=2))
        suggestions.append(f"{username}_{suffix}")
        suggestions.append(f"{username}{number}")

    return list(set(suggestions))[:count]


def send_email(email: str, subject: str, body: str):
    try:
        resend.api_key = settings.RESEND_API_KEY

        params: resend.Emails.SendParams = {
            "from": settings.EMAIL_HOST_USER,
            "to": ["heavycream9090@gmail.com"],
            "subject": subject,
            "html": body,
        }

        r = resend.Emails.send(params)
        return r
    except Exception as e:
        super_logger.error(e, exc_info=True)
        return None


def get_user_location():
    location_request = requests.get(
        f"https://geolocation-db.com/json/{os.environ.get('GEO_API_KEY')}"
    )

    location = ""
    if location_request.status_code == 200:
        location_data = location_request.json()
        location = f"{location_data.get('city')}, {location_data.get('country_name')}"

    utils_logger.debug(f"location status code: {location_request.status_code}")

    return location


def get_user_info(request: WSGIRequest | HttpRequest, user: WalletUser):
    # utils_logger.debug([{k: v} for k, v in request.META.items()])

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

        location = get_user_location()

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
            wallet_user_device.last_access = timezone.now()
            wallet_user_device.operational_system = f"{platform} {version}"
            wallet_user_device.d_ip_address = request.META.get("REMOTE_ADDR")
            wallet_user_device.location = location
            wallet_user_device.save()

    except Exception as e:
        utils_logger.error(e, exc_info=True)


def generate_master_password():
    """Generate a random master password."""
    password = ""
    for i in range(7):
        if i == 0:
            password += (
                "".join(
                    [
                        random.choice(string.ascii_uppercase + string.digits)
                        for _ in range(2)
                    ]
                )
                + "-"
            )
        else:
            password += (
                "".join(
                    [
                        random.choice(string.ascii_uppercase + string.digits)
                        for _ in range(6)
                    ]
                )
                + "-"
            )

    return password[:-1]

if __name__ == "__main__":  # pragma: no cover
    # print(suggest_username("pavel", 10))
    print(generate_master_password())
