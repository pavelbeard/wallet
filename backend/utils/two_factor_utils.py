### module for complicated logic ###
import contextlib
from calendar import timegm
from typing import Any, List

import jwt
from django.conf import settings
from django.http import HttpRequest
from django.middleware import csrf
from django.utils import timezone
from django_otp import devices_for_user
from django_otp.models import Device
from django_otp.plugins.otp_static.models import StaticDevice
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import authentication as jwt_authentication
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from stuff.models import WalletUser
from stuff.types import Action

from utils import qr_generator


@contextlib.contextmanager
def override_api_settings(**settings):
    """Using for unit tests"""
    old_settings = {}

    for key, value in settings.items():
        try:
            old_settings[key] = api_settings.user_settings[key]
        except KeyError:
            pass

        api_settings.user_settings[key] = value

        try:
            delattr(api_settings, key)
        except AttributeError:
            pass

    try:
        yield
    finally:
        for key in settings.keys():
            api_settings.user_settings.pop(key)

            try:
                api_settings.user_settings[key] = old_settings[key]
            except KeyError:
                pass

            try:
                delattr(api_settings, key)
            except AttributeError:
                pass


def get_user_totp_device(user, confirmed=None) -> TOTPDevice | None:
    devices: List[Device] = devices_for_user(user, confirmed=confirmed)
    for device in devices:
        if isinstance(device, TOTPDevice):
            return device


def jwt_custom_payload(
    user: WalletUser, device: TOTPDevice = None, Action: Action = Action.verify
) -> dict:
    """Optionally includes an OTP device in JWT,
    2FA verification, is user an Oauth user and is user having email verified"""

    # generate new pair of keys

    payload = {
        "username": "",
        "email": "",
        "exp": timezone.now() + settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
    }

    if getattr(user, "username") is not None:
        payload["username"] = user.username
    if getattr(user, "first_name") is not None:
        payload["first_name"] = user.first_name
    if getattr(user, "last_name") is not None:
        payload["last_name"] = user.last_name
    if getattr(user, "email") is not None:
        payload["email"] = user.email
    if getattr(user, "public_id") is not None:
        payload["public_id"] = user.public_id
    if getattr(user, "is_oauth_user") is not None:
        payload["is_oauth_user"] = user.is_oauth_user
    if getattr(user, "is_two_factor_enabled") is not None:
        payload["is_two_factor_enabled"] = user.is_two_factor_enabled
    if getattr(user, "email_verified") is not None:
        payload["is_email_verified"] = user.email_verified
        
    if user.is_oauth_user and user.image.name is not None:
        payload["image"] = user.image.name
    else:
        try:
            payload["image"] = user.image.url
        except ValueError:
            pass

    if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS"):
        payload["orig_iat"] = timegm(timezone.now().utctimetuple())

    if settings.SIMPLE_JWT.get("AUDIENCE"):
        payload["aud"] = settings.SIMPLE_JWT["AUDIENCE"]

    if settings.SIMPLE_JWT.get("ISSUER"):
        payload["iss"] = settings.SIMPLE_JWT["ISSUER"]

    if (
        (user is not None)
        and (device is not None)
        and (device.user_id == user.pk)
        and (device.confirmed is True)
        and (Action == Action.verify)
    ):
        payload["otp_device_id"] = device.persistent_id
        payload["created_at"] = device.created_at.strftime("%d %b %Y")
        payload["verified"] = True
    elif Action == Action.master_password:
        payload["otp_device_id"] = None
        payload["created_at"] = None
        payload["verified"] = True
    elif Action == Action.oauth2:
        payload["otp_device_id"] = None
        payload["created_at"] = None
        # if user is first oauth login (fast register), then mark it as verified
        if user.is_first_oauth_login:
            payload["verified"] = True
        else:
            payload["verified"] = False
    else:
        payload["otp_device_id"] = None
        payload["created_at"] = None
        payload["verified"] = False

    return payload


def jwt_encode_handler(payload) -> str:
    """Helps to encode data to JWT"""
    key = settings.SIMPLE_JWT["SIGNING_KEY"]
    return jwt.encode(payload, key, algorithm=settings.SIMPLE_JWT.get("ALGORITHM"))


def jwt_decode_handler(token) -> Any:
    """Helps to decode data from JWT"""
    options = {
        "verify_exp": True,
    }
    secret_key = settings.SIMPLE_JWT["SIGNING_KEY"]
    return jwt.decode(
        jwt=token,
        key=secret_key,
        options=options,
        # leeway=settings.SIMPLE_JWT.get('LEEWAY'),
        audience=settings.SIMPLE_JWT.get("AUDIENCE"),
        issuer=settings.SIMPLE_JWT.get("ISSUER"),
        algorithms=settings.SIMPLE_JWT.get("ALGORITHM"),
    )


def get_custom_jwt(
    user: WalletUser, device: Device = None, action: Action = Action.verify
) -> str:
    """Using for include 2FA into JWT"""
    payload = jwt_custom_payload(user, device, action)
    tokens = RefreshToken.for_user(user)

    for k, v in payload.items():
        if k == "exp" and tokens.token_type == "refresh":
            continue
        tokens[k] = v

    return {
        "access": str(tokens.access_token),
        "refresh": str(tokens),
    }


def otp_is_verified(request: Request):
    """Help to determine if user have verified OTP."""
    auth = jwt_authentication.JWTAuthentication()
    authorization_header = request.headers.get("Authorization") or request.META.get(
        "HTTP_AUTHORIZATION"
    )
    jwt_value = auth.get_raw_token(header=authorization_header)
    if jwt_value is None:
        return False

    payload = jwt_decode_handler(jwt_value)
    persistent_id = payload.get("otp_device_id")

    if persistent_id:
        device = Device.from_persistent_id(persistent_id=persistent_id)
        if (device is not None) and (device.user_id != request.user.public_id):
            return False
        else:
            return True
    else:
        return False


def get_user_static_device(user: WalletUser, confirmed=None) -> StaticDevice | None:
    devices = devices_for_user(user, confirmed=confirmed)
    for device in devices:
        if isinstance(device, StaticDevice):
            return device


def set_csrf_cookie(response: Response, request: HttpRequest):
    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=csrf.get_token(request),
        secure=settings.CSRF_COOKIE_SECURE,
        httponly=settings.CSRF_COOKIE_HTTPONLY,
        samesite=settings.CSRF_COOKIE_SAMESITE,
    )
    return response


def generate_2fa_key_in_qr_code(data):
    """Proxy function"""
    return qr_generator.generate_2fa_key_in_qr_code(data)
